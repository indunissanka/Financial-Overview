
import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

export const getFinancialAdvice = async (expenses: Expense[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const expenseSummary = expenses.map(e => `${e.date}: ${e.category} - $${e.amount} (${e.note})`).join('\n');
  
  const prompt = `
    As a professional financial advisor, analyze the following recent transactions and provide 3-4 actionable tips to save money or improve financial health. 
    Keep the tone encouraging, concise, and professional. Return the response in plain text with clear bullet points.
    
    Transactions:
    ${expenseSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text || "I couldn't generate advice at this moment. Keep tracking your expenses!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to connect to the AI advisor. Please check your spending patterns manually.";
  }
};
