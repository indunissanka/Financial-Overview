import { AIProvider, AIProviderConfig } from '../types';

export interface ScannedBillData {
  amount: number;
  merchant: string;
  category: string;
  date: string;
  items: string[];
  confidence: number;
  rawText: string;
}

export const extractBillDataFromImage = async (
  imageBase64: string,
  provider: AIProvider,
  config: AIProviderConfig
): Promise<ScannedBillData> => {
  if (provider === 'gemini') {
    return extractWithGemini(imageBase64, config.apiKey);
  } else if (provider === 'claude') {
    return extractWithClaude(imageBase64, config.apiKey);
  } else {
    throw new Error(`${provider} does not support image analysis. Please use Gemini or Claude for bill scanning.`);
  }
};

const extractWithGemini = async (
  imageBase64: string,
  apiKey: string
): Promise<ScannedBillData> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Look at this receipt/bill image and tell me:
1. The total amount (just the number)
2. Store/merchant name
3. Best category (Food, Transport, Shopping, Entertainment, Utilities, Health, Income, Others)

Format your response EXACTLY like this (no other text):
AMOUNT: [number]
MERCHANT: [name]
CATEGORY: [category]`,
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64.split(',')[1] || imageBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error?.message || `Gemini API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response from Gemini. Check your API key and quota.');
    }

    console.log('Gemini response:', content);

    // Parse simple text format
    const amountMatch = content.match(/AMOUNT:\s*([\d.]+)/i);
    const merchantMatch = content.match(/MERCHANT:\s*([^\n]+)/i);
    const categoryMatch = content.match(/CATEGORY:\s*([^\n]+)/i);

    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';
    const category = categoryMatch ? categoryMatch[1].trim() : 'Others';

    return {
      amount: amount || 0,
      merchant: merchant || 'Unknown',
      category: category || 'Others',
      date: new Date().toISOString().split('T')[0],
      items: [],
      confidence: amount > 0 ? 85 : 30,
      rawText: content,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to analyze bill with Gemini');
  }
};

const extractWithClaude = async (
  imageBase64: string,
  apiKey: string
): Promise<ScannedBillData> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64.split(',')[1] || imageBase64,
                },
              },
              {
                type: 'text',
                text: `Look at this receipt/bill image and tell me:
1. The total amount (just the number)
2. Store/merchant name
3. Best category (Food, Transport, Shopping, Entertainment, Utilities, Health, Income, Others)

Format your response EXACTLY like this (no other text):
AMOUNT: [number]
MERCHANT: [name]
CATEGORY: [category]`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error?.message || `Claude API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error('No response from Claude. Check your API key and billing.');
    }

    console.log('Claude response:', content);

    // Parse simple text format
    const amountMatch = content.match(/AMOUNT:\s*([\d.]+)/i);
    const merchantMatch = content.match(/MERCHANT:\s*([^\n]+)/i);
    const categoryMatch = content.match(/CATEGORY:\s*([^\n]+)/i);

    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';
    const category = categoryMatch ? categoryMatch[1].trim() : 'Others';

    return {
      amount: amount || 0,
      merchant: merchant || 'Unknown',
      category: category || 'Others',
      date: new Date().toISOString().split('T')[0],
      items: [],
      confidence: amount > 0 ? 85 : 30,
      rawText: content,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to analyze bill with Claude');
  }
};
