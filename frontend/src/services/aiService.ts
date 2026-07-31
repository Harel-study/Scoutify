import api from '../utils/axios';

export interface AiPostResult {
  originalContent: string;
  headline: string;
  post: string;
  summary: string;
  hashtags: string[];
  recommendedProfileImprovements: string[];
  missingInformation: string[];
  confidenceScore: number;
}

interface GeneratePostResponse {
  success: boolean;
  data: AiPostResult;
}

export const generateAiPost = async (
  content: string
): Promise<AiPostResult> => {
  const response = await api.post<GeneratePostResponse>(
    '/ai/improve-post',
    { content }
  );

  return response.data.data;
};