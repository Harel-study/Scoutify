/**
 * @module authService
 *
 * Handles authentication-related API requests.
 * Manages operations like password recovery and resets.
 */

import api from '../utils/axios';

/**
 * Represents the server response after requesting a password reset.
 */
export interface ForgotPasswordResponse {
  /** @type {string} A user-facing message confirming the email was sent. */
  message: string;
}

/**
 * Represents the server response after successfully resetting a password.
 */
export interface ResetPasswordResponse {
  /** @type {string} A user-facing message confirming the password was changed. */
  message: string;
}

/**
 * Initiates a password reset workflow for the provided email address.
 *
 * Sends a request to the backend to generate a reset token and email it
 * to the user. Does not throw if the user is not found, to prevent
 * email enumeration.
 *
 * @param  {string}  email  The registered email address of the user.
 * @returns {Promise<ForgotPasswordResponse>}  The server's response confirming the request.
 * @throws  {Error}  If the network request fails.
 */
export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Overwrites the user's password using a secure, single-use token.
 *
 * Verifies the token provided from the password reset email and updates
 * the user's credentials in the database if the token is valid and not expired.
 *
 * @param  {string}  token     The single-use token extracted from the reset email URL.
 * @param  {string}  password  The new password chosen by the user.
 * @returns {Promise<ResetPasswordResponse>}  The server's response confirming the update.
 * @throws  {Error}  If the token is invalid, expired, or the network request fails.
 */
export const resetPassword = async (token: string, password: string): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, { password });
  return response.data;
};
