import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing from environment variables');
}

const ai = new GoogleGenAI({ apiKey });

export interface RecruitmentPostResult {
  headline: string;
  post: string;
  summary: string;
  hashtags: string[];
  recommendedProfileImprovements: string[];
  missingInformation: string[];
  confidenceScore: number;
}

export const improvePostContent = async (
  content: string
): Promise<RecruitmentPostResult> => {
  const cleanedContent = content.trim();

  if (!cleanedContent) {
    throw new Error('Post content is required');
  }

  if (cleanedContent.length > 1000) {
    throw new Error('Post content cannot exceed 1000 characters');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: cleanedContent,
    config: {
      systemInstruction: `
You are Scoutify AI, a professional football recruitment assistant.

Create a professional recruitment post using only the information supplied by
the user.

Rules:
- Preserve every factual detail.
- Never invent clubs, statistics, experience, achievements, contact details,
  abilities or personality traits.
- Correct obvious spelling and grammar errors only when the intended meaning
  is clear.
- Ignore missing information instead of guessing it.
- Use the same language as the user's input.
- Write naturally for football clubs, coaches and scouts.
- Keep the post concise, credible and professional.
- confidenceScore measures profile-information completeness only, not the
  player's quality.
      `.trim(),

      maxOutputTokens: 1000,

      responseMimeType: 'application/json',

      responseSchema: {
        type: 'object',
        properties: {
          headline: {
            type: 'string',
            description: 'A professional headline of no more than 80 characters',
          },
          post: {
            type: 'string',
            description: 'The complete professional recruitment post',
          },
          summary: {
            type: 'string',
            description: 'A one-sentence factual summary of the player',
          },
          hashtags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          recommendedProfileImprovements: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          missingInformation: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          profileCompletenessScore: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            description: 'Profile completeness score, not player ability',
          },
        },
        required: [
          'headline',
          'post',
          'summary',
          'hashtags',
          'recommendedProfileImprovements',
          'missingInformation',
          'profileCompletenessScore',
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error('Gemini returned an empty response');
  }

  try {
    return JSON.parse(response.text) as RecruitmentPostResult;
  } catch {
    throw new Error('Gemini returned an invalid structured response');
  }
};