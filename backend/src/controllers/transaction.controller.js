const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');
const { getDateRange } = require('../utils/date.utils');
const {
  isTransactionPotentiallyDeductible,
} = require('../services/ai.service');
const {
  getUserOverallBalance,
  getTotalSavingsBalance,
  getSavingGoalDetails,
} = require('../services/balance.service');

async function createTransaction(req, res) {
  const { description, type } = req.body;
  const date = new Date(req.body.date);
  const amount = parseFloat(req.body.amount);
  const categoryId = parseInt(req.body.categoryId, 10);
  const userId = req.user.id;

  try {
    // check if all user input are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Ensure this category belongs to the user or a default one
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    if (category.userId !== userId && category.userId !== null) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to use this category' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        description: description,
        date: date,
        type: type,
        categoryId: categoryId,
        userId: userId,
      },
      include: {
        category: true,
      },
    });

    let isDeductible = false;

    if (type === 'EXPENSE') {
      isDeductible = await isTransactionPotentiallyDeductible(
        description,
        category.name
      );
    }

    res.status(201).json({
      message: 'Transaction created successfully.',
      transaction: transaction,
      isPotentiallyDeductible: isDeductible,
    });
  } catch (error) {
    console.error('Error creating a transaction', error);
    res
      .status(500)
      .json({ message: 'Could not create transaction. Please try again.' });
  }
}

async function getTransactions(req, res) {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 transactions per page

  // Optional filters
  const categoryId = parseInt(req.query.categoryId, 10);
  const dateRange = req.query.dateRange;
  const search = req.query.search;

  const whereOptions = {
    userId: userId,
  };

  if (!isNaN(categoryId)) {
    whereOptions.categoryId = categoryId;
  }

  if (dateRange) {
    whereOptions.date = getDateRange(dateRange);
  }

  if (search) {
    whereOptions.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { category: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Exclude TRANSFER transactions from SPEND action in savings
  whereOptions.linkedTransactionId = null;

  try {
    const [balance, totalSavingsBalance, totalTransactions, transactions] =
      await Promise.all([
        getUserOverallBalance(userId), // overall balance
        getTotalSavingsBalance(userId), // total savings balance
        prisma.transaction.count({ where: whereOptions }), // total transactions count
        prisma.transaction.findMany({
          where: whereOptions,
          orderBy: { date: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            category: true,
          },
        }),
      ]);

    res.status(200).json({
      message: 'Transactions fetched successfully.',
      transactions: transactions,
      balance: balance,
      totalSavingsBalance: totalSavingsBalance,
      pagination: {
        total: totalTransactions,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalTransactions / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching all transactions', error);
    res
      .status(500)
      .json({ message: 'Could not load transactions. Please try again.' });
  }
}

async function updateTransaction(req, res) {
  const transactionId = parseInt(req.params.transactionId, 10);
  const { description, type } = req.body;
  const date = new Date(req.body.date);
  const amount = parseFloat(req.body.amount);
  const categoryId = parseInt(req.body.categoryId, 10);
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Ensure this category belongs to the user or a default one
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(400).json({
        message: 'The specified category does not exist or is inaccessible.',
      });
    }

    if (category.userId !== userId && category.userId !== null) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to use this category' });
    }

    // This inherently checks if the transaction exists AND belongs to the user
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
        userId: userId,
      },
      data: {
        amount: amount,
        description: description,
        date: date,
        type: type,
        categoryId: categoryId,
      },
      include: {
        category: true,
      },
    });

    let isDeductible = false;

    if (type === 'EXPENSE') {
      isDeductible = await isTransactionPotentiallyDeductible(
        description,
        category.name
      );
    }

    res.status(200).json({
      message: 'Transaction updated successfully.',
      transaction: updatedTransaction,
      isPotentiallyDeductible: isDeductible,
    });
  } catch (error) {
    // Prisma's error code for "record to update not found".
    // This error occurs if the ID doesn't exist OR if the userId doesn't match.
    if (error.code === 'P2025') {
      return res.status(404).json({
        message:
          'Transaction not found or you do not have permission to edit it.',
      });
    }

    console.error('Error updating a transaction', error);
    res
      .status(500)
      .json({ message: 'Could not update transaction. Please try again.' });
  }
}

async function deleteTransaction(req, res) {
  const transactionId = parseInt(req.params.transactionId, 10);
  const userId = req.user.id;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // The delete will only happen if the transaction ID exists AND belongs to the user.
    const deletedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
        userId: userId,
      },
    });

    res.status(200).json({
      message: 'Transaction deleted successfully.',
      transaction: deletedTransaction,
    });
  } catch (error) {
    // Prisma's error code for "record to delete not found".
    if (error.code === 'P2025') {
      return res.status(404).json({
        message:
          'Transaction not found or you do not have permission to delete it.',
      });
    }
    console.error('Error deleting a transaction', error);
    res
      .status(500)
      .json({ message: 'Could not delete transaction. Please try again.' });
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
