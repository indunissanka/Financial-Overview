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
                text: `Analyze this receipt/bill image and extract the following information in JSON format:
{
  "amount": total amount as number,
  "merchant": store/company name,
  "category": best category (Food, Transport, Shopping, Entertainment, Utilities, Health, Income, Others),
  "date": date in YYYY-MM-DD format (if visible, otherwise today),
  "items": array of purchased items,
  "confidence": confidence level 0-100
}

Be precise with the amount. If currency symbol is present, extract just the number. Return ONLY valid JSON.`,
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

    // Extract JSON from response (it might be wrapped in markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini response:', content);
      throw new Error('Gemini did not return valid JSON. Try a clearer bill image.');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      amount: parseFloat(parsed.amount) || 0,
      merchant: parsed.merchant || 'Unknown',
      category: parsed.category || 'Others',
      date: parsed.date || new Date().toISOString().split('T')[0],
      items: Array.isArray(parsed.items) ? parsed.items : [],
      confidence: parsed.confidence || 0,
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
                text: `Analyze this receipt/bill image and extract the following information in JSON format:
{
  "amount": total amount as number,
  "merchant": store/company name,
  "category": best category (Food, Transport, Shopping, Entertainment, Utilities, Health, Income, Others),
  "date": date in YYYY-MM-DD format (if visible, otherwise today),
  "items": array of purchased items,
  "confidence": confidence level 0-100
}

Be precise with the amount. If currency symbol is present, extract just the number. Return ONLY valid JSON.`,
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

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Claude response:', content);
      throw new Error('Claude did not return valid JSON. Try a clearer bill image.');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      amount: parseFloat(parsed.amount) || 0,
      merchant: parsed.merchant || 'Unknown',
      category: parsed.category || 'Others',
      date: parsed.date || new Date().toISOString().split('T')[0],
      items: Array.isArray(parsed.items) ? parsed.items : [],
      confidence: parsed.confidence || 0,
      rawText: content,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to analyze bill with Claude');
  }
};
