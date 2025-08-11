const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');
const {
  getUserOverallBalance,
  getSavingGoalDetails,
} = require('../services/balance.service');

async function createSaving(req, res) {
  const { name, isTransfer } = req.body;
  const initialBalance = parseFloat(req.body.initialBalance) || 0;
  const targetAmount = req.body.targetAmount
    ? parseFloat(req.body.targetAmount)
    : null;
  const targetDate = req.body.targetDate ? new Date(req.body.targetDate) : null;
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if a transfer is needed and possible
    const shouldCreateTransfer = isTransfer && initialBalance > 0;

    if (shouldCreateTransfer) {
      const currentBalance = await getUserOverallBalance(userId);

      if (currentBalance < initialBalance) {
        return res.status(400).json({
          message: 'Insufficient funds to make the initial transfer.',
        });
      }

      // Use a nested write to create the goal and the linked transaction together
      const saving = await prisma.savingGoal.create({
        data: {
          name,
          initialBalance: 0, // If transferred, initial balance is 0
          targetAmount,
          targetDate,
          userId,
          transactions: {
            create: {
              amount: -initialBalance, // Negative for contribution
              description: `Initial contribution to ${name}`,
              type: 'TRANSFER',
              date: new Date(),
              userId,
              // categoryId is null by default for transfers
            },
          },
        },
        include: {
          transactions: true, // Include the created transaction in the response
        },
      });

      res.status(201).json({
        message: 'Saving goal and initial transfer created successfully.',
        saving,
        transferTransaction: saving.transactions[0],
      });
    } else {
      // No transfer needed, just create the saving goal
      const saving = await prisma.savingGoal.create({
        data: {
          name,
          initialBalance, // If not from Centsimple balance, set it to initial balance set by user
          targetAmount,
          targetDate,
          userId,
        },
      });

      res.status(201).json({
        message: 'Saving goal created successfully.',
        saving,
        transferTransaction: null,
      });
    }
  } catch (error) {
    console.error('Error creating a saving goal', error);
    res
      .status(500)
      .json({ message: 'Could not create saving goal. Please try again.' });
  }
}

async function getSavings(req, res) {
  const userId = req.user.id;

  try {
    // All the saving goals of the user
    const savings = await prisma.savingGoal.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // The total for each saving goal of the user
    const totalPerSaving = await prisma.transaction.groupBy({
      by: ['savingGoalId'],
      where: {
        userId: userId,
        savingGoalId: { not: null },
        type: 'TRANSFER',
      },
      _sum: {
        amount: true,
      },
    });

    const totalsMap = new Map(
      totalPerSaving.map((item) => [item.savingGoalId, item._sum.amount])
    );

    // Adding the total to each saving goal
    const savingsWithTotal = savings.map((saving) => {
      const total = totalsMap.get(saving.id) || 0;
      return {
        ...saving,
        currentBalance: saving.initialBalance - total,
      };
    });

    const totalSavingsBalance = savingsWithTotal.reduce(
      (total, saving) => total + saving.currentBalance,
      0
    );

    res.status(200).json({
      message: 'Savings fetched successfully.',
      savingsWithTotal: savingsWithTotal,
      totalSavingsBalance: totalSavingsBalance,
    });
  } catch (error) {
    console.error('Error fetching all savings', error);
    res
      .status(500)
      .json({ message: 'Could not load savings. Please try again.' });
  }
}

async function getSavingHistory(req, res) {
  const goalId = parseInt(req.params.goalId, 10);
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { saving, currentBalance } = await getSavingGoalDetails(
      goalId,
      userId
    );

    const savingHistory = await prisma.transaction.findMany({
      where: {
        savingGoalId: goalId,
        userId: userId,
        linkedTransactionId: null, // Exclude TRANSFER transactions for SPEND action
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.status(200).json({
      message: 'Saving history fetched successfully.',
      saving: saving,
      currentBalance: currentBalance,
      savingHistory: savingHistory,
    });
  } catch (error) {
    console.error('Error fetching saving history', error);
    res
      .status(500)
      .json({ message: 'Could not load saving history. Please try again.' });
  }
}

async function spendFromSaving(req, res) {
  const goalId = parseInt(req.params.goalId, 10);
  const { description } = req.body;
  const date = new Date(req.body.date);
  const amount = parseFloat(req.body.amount);
  const categoryId = parseInt(req.body.categoryId, 10);
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const details = await getSavingGoalDetails(goalId, userId);

    if (!details) {
      return res.status(404).json({
        message:
          'Saving goal not found or you do not have permission to edit it.',
      });
    }

    const { saving, currentBalance } = details;

    if (currentBalance < amount) {
      return res.status(400).json({
        message: 'Insufficient funds to spend from this saving goal.',
      });
    }

    // If there is enough balance, create EXPENSE and TRANSFER transactions
    // Use a sequential transaction to link the two operations
    const { expenseTransaction, transferTransaction } =
      await prisma.$transaction(async (tx) => {
        // 1. Create the EXPENSE transaction first
        const expenseTx = await tx.transaction.create({
          data: {
            amount: amount, // Expenses should be positive
            description: `Spent from ${saving.name}: ${description}`,
            date: date,
            type: 'EXPENSE',
            categoryId: categoryId,
            userId: userId,
            savingGoalId: goalId, // Link this expense to the saving goal
          },
          include: {
            category: true,
          },
        });

        // 2. Create the positive TRANSFER and link it to the expense
        const transferTx = await tx.transaction.create({
          data: {
            amount: amount, // Positive for withdrawal from savings
            description: `Withdrawal from ${saving.name}: ${description}`,
            date: date,
            type: 'TRANSFER',
            categoryId: null,
            userId: userId,
            savingGoalId: goalId, // Link this transfer to the saving goal
            linkedTransactionId: expenseTx.id, // Link this to the first expense tx
          },
        });

        return {
          expenseTransaction: expenseTx,
          transferTransaction: transferTx,
        };
      });

    res.status(201).json({
      message: 'Expense and transfer created successfully.',
      expenseTransaction: expenseTransaction,
      transferTransaction: transferTransaction,
    });
  } catch (error) {
    console.error('Error spending from a saving goal', error);
    res
      .status(500)
      .json({ message: 'Could not spend from saving goal. Please try again.' });
  }
}

async function transferSaving(req, res) {
  const goalId = parseInt(req.params.goalId, 10);
  const date = new Date(req.body.date);
  const amount = parseFloat(req.body.amount); // Positive for withdrawal, negative for contribution
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Fetch details at the top level of the function
    const details = await getSavingGoalDetails(goalId, userId);
    if (!details) {
      return res.status(404).json({ message: 'Saving goal not found.' });
    }

    // Destructure for easy access
    const { saving, currentBalance } = details;

    if (amount > 0) {
      // Withdrawal from saving
      if (currentBalance < amount) {
        return res
          .status(400)
          .json({ message: 'Insufficient funds in this saving goal.' });
      }
    } else if (amount < 0) {
      // Contribution to saving
      const overallBalance = await getUserOverallBalance(userId);
      if (overallBalance < Math.abs(amount)) {
        return res
          .status(400)
          .json({ message: 'Insufficient funds to make the transfer.' });
      }
    }

    const transferTransaction = await prisma.transaction.create({
      data: {
        amount: amount,
        description: `${
          amount > 0 ? 'Withdrawal from' : 'Contribution to'
        } ${saving.name}`,
        date: date,
        type: 'TRANSFER',
        categoryId: null,
        userId: userId,
        savingGoalId: goalId,
      },
    });

    res.status(201).json({
      message: 'Transfer created successfully.',
      transferTransaction: transferTransaction,
    });
  } catch (error) {
    console.error('Error transferring to/from a saving goal', error);
    res.status(500).json({
      message: 'Could not transfer to/from saving goal. Please try again.',
    });
  }
}

module.exports = {
  createSaving,
  getSavings,
  getSavingHistory,
  spendFromSaving,
  transferSaving,
};
