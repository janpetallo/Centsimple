const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateFinancialSummary(financialData) {
  try {
    const dataString = `
    - Total Income: ${financialData.totalIncome.toFixed(2)} CAD
    - Total Expense: ${financialData.totalExpense.toFixed(2)} CAD
    - Net Balance: ${financialData.balance.toFixed(2)} CAD
    - Expense Breakdown: ${financialData.expenseBreakdown.map((item) => 
        `${item.categoryName}: ${item.total.toFixed(2)} CAD`).join(', ')}
    `;

    const prompt = `You are a friendly and encouraging Canadian financial analyst for an app called Centsimple. Your tone is helpful and professional, but not robotic. Do not give prescriptive financial advice.

    Based on the following financial data for the user, provide a short, easy-to-read summary (2-3 sentences max).

    The summary should include:
    1. A brief, one-sentence overview of their financial activity.
    2. An encouraging observation or a small, general educational tip related to their spending.

    Here is the user's financial data:
    ${dataString}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const summary = response.text;
    return summary;
  } catch (error) {
    console.error('Error communicating with the Gemini API:', error);
    throw new Error('Failed to generate AI summary.');
  }
}

module.exports = {
  generateFinancialSummary,
};
