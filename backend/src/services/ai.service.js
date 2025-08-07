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

async function isTransactionPotentiallyDeductible(description, categoryName) {
  try {
    const dataString = `
    - Description: ${description}
    - Category: ${categoryName}
    `;

    const prompt = `You are a tax expense classifier. 
    
      Based on the following transaction, is it potentially related to a common Canadian tax deduction? 
      Respond with only the word 'YES' or 'NO'.

      **Context for this classification:**
      ${dataString}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    if (response.text.trim().toUpperCase() === 'YES') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error communicating with the Gemini API:', error);
    throw new Error('Failed to validate transaction.');
  }
}

async function generateTaxTip(description, categoryName) {
  try {
    const dataString = `
    - Description: ${description}
    - Category: ${categoryName}
    `;

    const prompt = `You are an AI assistant for a Canadian finance app called Centsimple. Your goal is to provide a helpful, educational tip if a user's expense is potentially tax-deductible.

      **Your Guiding Principles:**
      1.  **Persona & Tone:** Act as a helpful Canadian tax expert. Your tone is clear, encouraging, and easy to understand.
      2.  **Simplicity:** Use simple, everyday language. Do not use financial jargon.
      3.  **Safety & Disclaimers:** You are an educational tool, not a tax preparer. Your tip MUST include a clear and simple sentence explaining that users can generally only claim expenses they paid for out-of-pocket that were **not reimbursed** by an insurance plan or any other source. Advise them to consult official CRA guidelines or a professional for specifics.     
      4.  **Brevity & Directness:** The tip should be concise (2-3 sentences). Do not include any greetings, intros, or sign-offs.

      **Content Requirements (Follow Strictly):**
      1.  Provide a short, educational tip explaining why this type of expense might be relevant for their taxes.
      2.  **If a specific official Canadian tax form or type of receipt (e.g., T2202 for tuition, official donation receipt for charity) is associated with the expense, you MUST mention it by name.**

      **Transaction to Analyze:**
      ${dataString}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const tip = response.text;
    return tip;
  } catch (error) {
    console.error('Error communicating with the Gemini API:', error);
    throw new Error('Failed to generate tax tip.');
  }
}

module.exports = {
  generateFinancialSummary,
  isTransactionPotentiallyDeductible,
  generateTaxTip,
};
