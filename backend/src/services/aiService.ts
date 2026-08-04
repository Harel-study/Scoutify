/**
 * @module aiService
 *
 * Service module for AI-assisted football recruitment post generation.
 * Communicates with the Google GenAI (Gemini) API to transform raw user input
 * into polished, structured recruitment posts with anti-hallucination constraints.
 */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// Validate API credential before initializing client to fail fast on configuration errors
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing from environment variables');
}

/** Google GenAI client instance initialized with environment credentials. */
const ai = new GoogleGenAI({ apiKey });

/**
 * Represents the structured response returned after AI post processing.
 */
export interface RecruitmentPostResult {
  /** Professional headline summarizing the recruitment post (max 80 chars). */
  headline: string;
  /** Complete formatted recruitment post body. */
  post: string;
  /** One-sentence factual summary of the player's core attributes. */
  summary: string;
  /** Relevant hashtags for recruitment post visibility. */
  hashtags: string[];
  /** Actionable recommendations for enhancing the player's profile. */
  recommendedProfileImprovements: string[];
  /** Player details absent from the user input that would strengthen the post. */
  missingInformation: string[];
  /** Completeness rating (0-100) reflecting profile detail level, not player ability. */
  confidenceScore: number;
}

/**
 * Transforms raw user text into a structured, professional recruitment post using Gemini AI.
 *
 * Applies strict system instructions to prevent AI hallucination, preserving exact facts
 * from user input while analyzing missing details and suggesting profile improvements.
 *
 * @param  {string}  content  Raw user input describing player achievements and details.
 * @returns {Promise<RecruitmentPostResult>}  Structured recruitment post object containing headline, post body, and analysis.
 * @throws  {Error}  If content is empty, whitespace-only, or exceeds 1000 characters.
 * @throws  {Error}  If Gemini API fails or returns an unparseable response.
 */
export const improvePostContent = async (
  content: string
): Promise<RecruitmentPostResult> => {
  const cleanedContent = content.trim();

  // Guard against missing content or inputs exceeding prompt token budgets
  if (!cleanedContent) {
    throw new Error('Post content is required');
  }

  if (cleanedContent.length > 1000) {
    throw new Error('Post content cannot exceed 1000 characters');
  }

  // Request structured JSON output from Gemini model using strict anti-hallucination instructions
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

      // NOTE: Schema defines 'profileCompletenessScore', whereas systemInstruction and RecruitmentPostResult interface use 'confidenceScore'.
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

  // Parse and cast structured JSON output to response interface
  try {
    return JSON.parse(response.text) as RecruitmentPostResult;
  } catch {
    throw new Error('Gemini returned an invalid structured response');
  }
};