import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

// Type for different AI providers
export type AIProvider = 'gemini' | 'chatgpt' | 'deepseek' | 'claude' | 'groq';

export interface AIProviderCredentials {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

const buildFinancialPrompt = (expenseSummary: string): string => {
  return `
As a professional financial advisor, analyze the following recent transactions and provide 3-4 actionable tips to save money or improve financial health. 
Keep the tone encouraging, concise, and professional. Return the response in plain text with clear bullet points.

Transactions:
${expenseSummary}
`;
};

/**
 * Get financial advice from Gemini (Google AI)
 */
export const getAdviceFromGemini = async (expenses: Expense[], apiKey: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const expenseSummary = expenses.map(e => `${e.date}: ${e.category} - $${e.amount} (${e.note})`).join('\n');
    const prompt = buildFinancialPrompt(expenseSummary);

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
    throw new Error("Failed to connect to Gemini. Please check your API key.");
  }
};

/**
 * Get financial advice from ChatGPT (OpenAI)
 */
export const getAdviceFromChatGPT = async (expenses: Expense[], apiKey: string): Promise<string> => {
  try {
    const expenseSummary = expenses.map(e => `${e.date}: ${e.category} - $${e.amount} (${e.note})`).join('\n');
    const prompt = buildFinancialPrompt(expenseSummary);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional financial advisor.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'ChatGPT API error');
    }

    const data = await response.json();
    return data.choices[0].message.content || "I couldn't generate advice at this moment. Keep tracking your expenses!";
  } catch (error) {
    console.error("ChatGPT Error:", error);
    throw new Error("Failed to connect to ChatGPT. Please check your API key.");
  }
};

/**
 * Get financial advice from DeepSeek
 */
export const getAdviceFromDeepSeek = async (expenses: Expense[], apiKey: string): Promise<string> => {
  try {
    const expenseSummary = expenses.map(e => `${e.date}: ${e.category} - $${e.amount} (${e.note})`).join('\n');
    const prompt = buildFinancialPrompt(expenseSummary);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional financial advisor.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'DeepSeek API error');
    }

    const data = await response.json();
    return data.choices[0].message.content || "I couldn't generate advice at this moment. Keep tracking your expenses!";
  } catch (error) {
    console.error("DeepSeek Error:", error);
    throw new Error("Failed to connect to DeepSeek. Please check your API key.");
  }
};

/**
 * Get financial advice from Claude (Anthropic)
 */
export const getAdviceFromClaude = async (expenses: Expense[], apiKey: string): Promise<string> => {
  try {
    const expenseSummary = expenses.map(e => `${e.date}: ${e.category} - $${e.amount} (${e.note})`).join('\n');
    const prompt = buildFinancialPrompt(expenseSummary);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: 'You are a professional financial advisor.',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API error');
    }

    const data = await response.json();
    return data.content[0].text || "I couldn't generate advice at this moment. Keep tracking your expenses!";
  } catch (error) {
    console.error("Claude Error:", error);
    throw new Error("Failed to connect to Claude. Please check your API key.");
  }
};

/**
 * Get financial advice from Groq
 */
export const getAdviceFromGroq = async (expenses: Expense[], apiKey: string): Promise<string> => {
  try {
    const expenseSummary = expenses.map(e => `${e.date}: ${e.category} - $${e.amount} (${e.note})`).join('\n');
    const prompt = buildFinancialPrompt(expenseSummary);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a professional financial advisor.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API error');
    }

    const data = await response.json();
    return data.choices[0].message.content || "I couldn't generate advice at this moment. Keep tracking your expenses!";
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to connect to Groq. Please check your API key.");
  }
};

/**
 * Main function to get financial advice from the selected AI provider
 */
export const getFinancialAdvice = async (
  expenses: Expense[],
  provider: AIProvider,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error(`No API key provided for ${provider}. Please configure your AI provider in settings.`);
  }

  switch (provider) {
    case 'gemini':
      return getAdviceFromGemini(expenses, apiKey);
    case 'chatgpt':
      return getAdviceFromChatGPT(expenses, apiKey);
    case 'deepseek':
      return getAdviceFromDeepSeek(expenses, apiKey);
    case 'claude':
      return getAdviceFromClaude(expenses, apiKey);
    case 'groq':
      return getAdviceFromGroq(expenses, apiKey);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
};

/**
 * Get the default model for each provider
 */
export const getDefaultModel = (provider: AIProvider): string => {
  const models: Record<AIProvider, string> = {
    gemini: 'gemini-3-flash-preview',
    chatgpt: 'gpt-3.5-turbo',
    deepseek: 'deepseek-chat',
    claude: 'claude-3-haiku-20240307',
    groq: 'mixtral-8x7b-32768',
  };
  return models[provider];
};

/**
 * Get provider information for display
 */
export const getProviderInfo = (provider: AIProvider) => {
  const info: Record<AIProvider, { name: string; description: string; docsUrl: string }> = {
    gemini: {
      name: 'Google Gemini',
      description: 'Fast and efficient AI by Google',
      docsUrl: 'https://ai.google.dev/docs',
    },
    chatgpt: {
      name: 'ChatGPT (OpenAI)',
      description: 'Powerful language model by OpenAI',
      docsUrl: 'https://platform.openai.com/docs',
    },
    deepseek: {
      name: 'DeepSeek',
      description: 'Advanced AI by DeepSeek',
      docsUrl: 'https://www.deepseek.com/docs',
    },
    claude: {
      name: 'Claude (Anthropic)',
      description: 'Safe and helpful AI by Anthropic',
      docsUrl: 'https://docs.anthropic.com',
    },
    groq: {
      name: 'Groq',
      description: 'Ultra-fast LLM inference',
      docsUrl: 'https://console.groq.com/docs',
    },
  };
  return info[provider];
};
