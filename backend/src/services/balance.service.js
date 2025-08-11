const prisma = require('../config/prisma');

// --- Helper Function for Overall Balance ---
async function getUserOverallBalance(userId) {
  const incomeResult = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { userId, type: 'INCOME' },
  });
  const expenseResult = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { userId, type: 'EXPENSE' },
  });
  const transferResult = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { userId, type: 'TRANSFER' },
  }); // Contribute to savings is NEGATIVE, Withdraw from savings is POSITIVE

  const totalIncome = incomeResult._sum.amount || 0;
  const totalExpense = expenseResult._sum.amount || 0;
  const totalTransfers = transferResult._sum.amount || 0;

  const currentBalance = totalIncome - totalExpense + totalTransfers;

  return currentBalance;
}

// --- Helper Function for a Single Saving Goal's Details & Balance ---
async function getSavingGoalDetails(goalId, userId) {
  const saving = await prisma.savingGoal.findUnique({
    where: { id: goalId, userId: userId },
  });

  if (!saving) {
    return null;
  }

  const totalTransfers = await prisma.transaction.aggregate({
    where: {
      userId: userId,
      savingGoalId: goalId,
      type: 'TRANSFER',
    },
    _sum: { amount: true },
  });

  const currentBalance =
    saving.initialBalance - (totalTransfers._sum.amount || 0);

  return { saving, currentBalance };
}

// --- Helper Function for Total Savings Balance ---
async function getTotalSavingsBalance(userId) {
  const initialBalanceSum = await prisma.savingGoal.aggregate({
    where: { userId: userId },
    _sum: {
      initialBalance: true,
    },
  });
  const totalInitialBalance = initialBalanceSum._sum.initialBalance || 0;

  const transferSum = await prisma.transaction.aggregate({
    where: {
      userId: userId,
      type: 'TRANSFER',
    },
    _sum: {
      amount: true,
    },
  });
  const totalTransfers = transferSum._sum.amount || 0;

  return totalInitialBalance - totalTransfers;
}

module.exports = {
  getUserOverallBalance,
  getSavingGoalDetails,
  getTotalSavingsBalance,
};
