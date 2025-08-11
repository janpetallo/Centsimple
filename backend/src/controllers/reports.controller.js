const prisma = require('../config/prisma');
const { generateFinancialSummary } = require('../services/ai.service');

async function calculateReportData(userId, dateRange) {
  const whereOptions = {
    userId: userId,
  };

  if (dateRange) {
    const now = new Date();
    let startDate;
    let endDate; // Use an end date for specific ranges

    // It's good practice to make these consistent (e.g., all lowercase or camelCase)
    switch (dateRange) {
      case 'last7days':
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last30days':
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case 'last90days':
        startDate = new Date();
        startDate.setDate(now.getDate() - 90);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        // First day of the previous month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        // First day of the current month
        endDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        // First day of the previous year
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        // First day of the current year
        endDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        break;
    }

    if (startDate) {
      startDate.setHours(0, 0, 0, 0); // Set to start of the day
      whereOptions.date = { gte: startDate };
    }
    if (endDate) {
      whereOptions.date = { ...whereOptions.date, lt: endDate };
    }
  }

  try {
    // CALCULATE BALANCE and BREAKDOWN
    const [
      totalIncomeResult,
      totalExpenseResult,
      rawExpenseBreakdown,
      totalSavingContributionResult,
      totalSavingWithdrawalResult,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          ...whereOptions,
          type: 'INCOME',
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereOptions,
          type: 'EXPENSE',
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          ...whereOptions,
          type: 'EXPENSE',
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: { amount: 'desc' },
        },
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereOptions,
          type: 'TRANSFER',
          amount: { lt: 0 }, // Contributions are negative
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereOptions,
          type: 'TRANSFER',
          amount: { gt: 0 }, // Withdrawals are positive
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Handle potential null sums by defaulting to 0
    const totalIncome = totalIncomeResult._sum.amount || 0;
    const totalExpense = totalExpenseResult._sum.amount || 0;
    const netEarnSpend = totalIncome - totalExpense;

    const totalSavingContribution =
      Math.abs(totalSavingContributionResult._sum.amount) || 0;
    const totalSavingWithdrawal = totalSavingWithdrawalResult._sum.amount || 0;
    const netSavings = totalSavingContribution - totalSavingWithdrawal;

    // Get the category IDs from the groupBy result.
    const categoryIds = rawExpenseBreakdown.map((item) => item.categoryId);

    // Fetch the actual category records for those IDs.
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
    });

    // Create a quick lookup map for categories.
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    // Combine the groupBy results with the category names.
    const expenseBreakdown = rawExpenseBreakdown.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) || 'Unknown',
      total: item._sum.amount || 0,
    }));

    return {
      netEarnSpend: netEarnSpend,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      expenseBreakdown: expenseBreakdown,
      netSavings: netSavings,
      totalSavingContribution: totalSavingContribution,
      totalSavingWithdrawal: totalSavingWithdrawal,
      startDate: whereOptions.date ? whereOptions.date.gte : null,
      endDate: whereOptions.date ? whereOptions.date.lt : null,
    };
  } catch (error) {
    console.error('Error calculating report data', error);
    throw new Error('Could not load your report. Please try again.');
  }
}

async function getSummaryReport(req, res) {
  const userId = req.user.id;
  const dateRange = req.query.dateRange;

  try {
    const reportData = await calculateReportData(userId, dateRange);
    res.status(200).json({
      message: 'Summary report fetched successfully.',
      ...reportData,
    });
  } catch (error) {
    console.error('Error fetching summary report', error);
    res.status(500).json({ message: error.message });
  }
}

async function getAiSummary(req, res) {
  const userId = req.user.id;
  const dateRange = req.query.dateRange;

  try {
    const reportData = await calculateReportData(userId, dateRange);
    if (reportData.totalIncome === 0 && reportData.totalExpense === 0) {
      return res.status(200).json({
        message:
          "There's no transaction data for this period, so no insights are available yet. Add some transactions to get started!",
      });
    }
    const summary = await generateFinancialSummary(reportData, dateRange);
    res.status(200).json({
      message: 'AI summary fetched successfully.',
      summary: summary,
    });
  } catch (error) {
    console.error('Error fetching AI summary', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getSummaryReport,
  getAiSummary,
};
