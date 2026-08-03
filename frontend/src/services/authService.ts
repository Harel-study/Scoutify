import api from '../utils/axios';

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Sends a password reset request for the specified email.
 *
 * @param email - User's email address
 */
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Resets the password using a single-use token from email.
 *
 * @param token - Single-use raw reset token from URL
 * @param password - New password
 */
export const resetPassword = async (token: string, password: string): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, { password });
  return response.data;
};
