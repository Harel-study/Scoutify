/**
 * @module aiService
 *
 * Handles AI-powered content generation and improvement.
 * Integrates with the backend AI endpoints to process and enhance user posts.
 */

import api from '../utils/axios';

/**
 * Represents the structured result of an AI-generated post improvement.
 *
 * Contains both the generated content for public display and metadata
 * intended to help the user improve their future posts.
 */
export interface AiPostResult {
  /** @type {string} The raw content originally submitted for improvement. */
  originalContent: string;
  /** @type {string} A catchy headline generated for the post. */
  headline: string;
  /** @type {string} The refined and improved post content. */
  post: string;
  /** @type {string} A brief summary of the post's main points. */
  summary: string;
  /** @type {string[]} Relevant hashtags suggested for the post. */
  hashtags: string[];
  /** @type {string[]} Suggestions on how the user could improve their profile context. */
  recommendedProfileImprovements: string[];
  /** @type {string[]} Details or context that the AI found lacking in the original post. */
  missingInformation: string[];
  /** @type {number} The AI's confidence in the generated improvements. */
  confidenceScore: number;
}

/**
 * Represents the API response structure from the post improvement endpoint.
 */
interface GeneratePostResponse {
  success: boolean;
  data: AiPostResult;
}

/**
 * Generates an improved post and metadata from raw user content using AI.
 *
 * Sends the user's draft content to the AI improvement endpoint and extracts
 * the structured results, including a headline, summary, and suggested hashtags.
 *
 * @param   {string}  content  The raw, unedited post content provided by the user.
 * @returns {Promise<AiPostResult>}  The structured result containing the improved post and analysis.
 */
export const generateAiPost = async (
  content: string
): Promise<AiPostResult> => {
  const response = await api.post<GeneratePostResponse>(
    '/ai/improve-post',
    { content }
  );

  return response.data.data;
};