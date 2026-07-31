import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing from environment variables');
}

const ai = new GoogleGenAI({ apiKey });

export const improvePostContent = async (
  content: string
): Promise<string> => {
  const cleanedContent = content.trim();

  if (!cleanedContent) {
    throw new Error('Post content is required');
  }

  if (cleanedContent.length > 1000) {
    throw new Error('Post content cannot exceed 1000 characters');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: cleanedContent,
    config: {
      systemInstruction: `
You improve posts for Scoutify, a professional football networking platform.

Rewrite the user's text as a clear, concise and professional post.

Rules:
- Preserve every fact supplied by the user.
- Do not invent clubs, statistics, experience, achievements or contact details.
- Use the same language as the original text.
- Return only the improved post.
      `.trim(),
      maxOutputTokens: 300,
    },
  });

  const improvedContent = response.text?.trim();

  if (!improvedContent) {
    throw new Error('Gemini returned an empty response');
  }

  return improvedContent;
};