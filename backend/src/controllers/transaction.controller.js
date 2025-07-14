const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');

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
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: transaction,
    });
  } catch (error) {
    console.error('Error creating a transaction', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getTransactions(req, res) {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 transactions per page

  try {
    const totalTransactions = await prisma.transaction.count({
      where: { userId: userId },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: userId },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalIncomeResult = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: 'INCOME',
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenseResult = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: 'EXPENSE',
      },
      _sum: {
        amount: true,
      },
    });

    // Handle potential null sums by defaulting to 0
    const totalIncome = totalIncomeResult._sum.amount || 0;
    const totalExpense = totalExpenseResult._sum.amount || 0;

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions: transactions,
      balance: balance,
      pagination: {
        total: totalTransactions,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalTransactions / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching all transactions', error);
    res.status(500).json({ message: 'Internal server error' });
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
    });

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
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
    res.status(500).json({ message: 'Internal server error' });
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
      message: 'Transaction deleted successfully',
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
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
