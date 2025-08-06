const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateFinancialSummary(financialData, dateRange) {
  try {
    const dataString = `
    - Total Income: ${financialData.totalIncome.toFixed(2)} CAD
    - Total Expense: ${financialData.totalExpense.toFixed(2)} CAD
    - Net Balance: ${financialData.balance.toFixed(2)} CAD
    - Expense Breakdown: ${financialData.expenseBreakdown
      .map((item) => `${item.categoryName}: ${item.total.toFixed(2)} CAD`)
      .join(', ')}
    `;

    const prompt = `You are a financial analyst for the Centsimple app. Your goal is to provide an encouraging, clear, and insightful financial summary in 2-3 concise sentences.

        **Your Guiding Principles:**
        1.  **Persona & Tone:** Be an empathetic and professional financial analyst. Your tone is always encouraging, never judgmental.
        2.  **Simplicity:** Use simple, everyday language. Absolutely no financial jargon.
        3.  **Brevity & Directness:** Give the summary immediately. No greetings, intros, or sign-offs (e.g., "Hello," "Here is your summary...").
        4.  **Variety:** Do not use the same exact sentence structure for every summary. Vary your phrasing to sound natural.

        **Content Logic (Follow Strictly):**
        - **IF Net Balance is positive:** The first sentence must celebrate that they saved money. The second sentence must provide an encouraging insight about their successful saving habits.
        - **ELSE (if Net Balance is zero or negative):** The first sentence must be a neutral, non-judgmental observation that their spending was higher than their income. The second sentence must gently highlight a significant, non-essential spending area (like Shopping, Entertainment) as a helpful point for reflection.

        **Context for this summary:**
        - Time Period: ${dateRange}
        - Financial Data: ${dataString}
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
