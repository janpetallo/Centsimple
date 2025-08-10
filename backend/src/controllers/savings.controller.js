const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');

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
      const incomeResult = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId: userId, type: 'INCOME' },
      });

      const expenseResult = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId: userId, type: 'EXPENSE' },
      });

      const transferResult = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId: userId, type: 'TRANSFER' },
      }); // Contribute to savings is NEGATIVE, Withdraw from savings is POSITIVE

      const totalIncome = incomeResult._sum.amount || 0;
      const totalExpense = expenseResult._sum.amount || 0;
      const totalTransfers = transferResult._sum.amount || 0;

      const currentBalance = totalIncome - totalExpense + totalTransfers;

      if (currentBalance < initialBalance) {
        return res.status(400).json({
          message: 'Insufficient funds to make the initial transfer.',
        });
      }

      const [saving, transferTransaction] = await prisma.$transaction([
        prisma.savingGoal.create({
          data: {
            name,
            initialBalance: 0, // If transfered from Centsimple balance, set this to 0 and create a negative transaction below
            targetAmount,
            targetDate,
            userId,
          },
        }),
        prisma.transaction.create({
          data: {
            amount: -initialBalance, // Contribute to savings is NEGATIVE
            description: `Initial transfer to ${name}`,
            type: 'TRANSFER',
            date: new Date(),
            categoryId: null,
            userId,
          },
        }),
      ]);

      res.status(201).json({
        message: 'Saving goal and initial transfer created successfully.',
        saving,
        transferTransaction,
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

async function getSavings(req, res) {}

module.exports = {
  createSaving,
  getSavings,
};
