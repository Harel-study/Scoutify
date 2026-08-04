/**
 * @module passport
 *
 * Google OAuth2 token verification service for Scoutify authentication.
 * Uses Google's official auth library to validate identity tokens sent from client apps,
 * with built-in support for mock tokens during development and testing.
 */

import { OAuth2Client } from 'google-auth-library';

/** Global OAuth2 client instance for token signature verification. */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Normalized user identity claims extracted from a verified Google ID token.
 */
export interface GoogleTokenPayload {
  /** User's primary email address associated with their Google account. */
  email: string;
  /** Unique Google account subject ID (`sub` claim). */
  googleId: string;
  /** User's full display name if provided by Google. */
  name?: string;
}

/**
 * Validates a Google OAuth ID token and extracts normalized user claims.
 *
 * Checks for development mock token prefixes in non-production environments to enable
 * local testing without live Google API keys. In production, verifies token authenticity
 * and audience directly with Google authentication servers.
 *
 * @param  {string}  idToken  The raw ID token string sent from the client application.
 * @returns {Promise<GoogleTokenPayload>}  Normalized user payload containing email, googleId, and name.
 * @throws  {Error}  If GOOGLE_CLIENT_ID environment variable is unconfigured.
 * @throws  {Error}  If Google ID token verification fails or claims (`sub`, `email`) are missing.
 */
export const verifyGoogleToken = async (
  idToken: string
): Promise<GoogleTokenPayload> => {
  // Support local development & automated integration tests with mock token fallback
  if (process.env.NODE_ENV !== 'production' && idToken.startsWith('mock_')) {
    return {
      googleId: idToken,
      email: `${idToken}@mock.scoutify.com`,
      name: `Mock ${idToken.replace('mock_', '')}`,
    };
  }

  // Guard against missing Google client ID before calling remote verification API
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  // Verify ID token cryptographically against Google public keys and audience
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // Enforce mandatory profile claims required for user account creation/association
  if (!payload?.sub || !payload.email) {
    throw new Error('Invalid Google token payload');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
  };
};