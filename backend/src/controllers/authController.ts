/**
 * @module Controllers/authController
 *
 * Handles user authentication, registration, token generation, and OAuth flows.
 * Manages JWT issuing, validation, and refresh token rotation.
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import PlayerProfile from '../models/PlayerProfile.js';
import Team from '../models/Team.js';
import StaffProfile from '../models/StaffProfile.js';
import { verifyGoogleToken } from '../config/passport.js';
import { registerSchema, loginSchema, googleLoginSchema } from '../validation/joiSchemas.js';
import logger from '../config/logger.js';

/**
 * Generates a short-lived JSON Web Token (JWT) for API access.
 *
 * @param {{ _id: any; username: string; email?: string; role: string }} user - The user object to encode in the payload.
 * @returns {string} The signed access token.
 */
const generateAccessToken = (user: { _id: any; username: string; email?: string; role: string }) => {
  return jwt.sign(
    { id: user._id.toString(), username: user.username, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret',
    { expiresIn: '15m' }
  );
};

/**
 * Generates a long-lived JSON Web Token (JWT) for refreshing access tokens.
 *
 * @param {{ _id: any }} user - The user object containing the database ID.
 * @returns {string} The signed refresh token.
 */
const generateRefreshToken = (user: { _id: any }) => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
    { expiresIn: '7d' }
  );
};

/**
 * Extracts the refresh token from the request cookies manually.
 *
 * @param {Request} req - The Express request object.
 * @returns {string | undefined} The parsed refresh token, or undefined if not found.
 */
const getRefreshTokenFromCookie = (req: Request): string | undefined => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(';').reduce((acc, c) => {
    const [key, val] = c.trim().split('=');
    if (key && val) acc[key] = decodeURIComponent(val);
    return acc;
  }, {} as Record<string, string>);

  return cookies.refreshToken;
};

/**
 * Attaches the refresh token to the response as an HTTP-only cookie.
 *
 * Enforces security settings based on the environment (e.g., Secure flag in production).
 *
 * @param {Response} res - The Express response object.
 * @param {string} token - The refresh token to embed in the cookie.
 */
const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  // set cookie options
  let cookieString = `refreshToken=${encodeURIComponent(token)}; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;
  if (isProduction) {
    cookieString += '; Secure';
  }
  res.setHeader('Set-Cookie', cookieString);
};

/**
 * Clears the refresh token cookie from the client's browser.
 *
 * @param {Response} res - The Express response object.
 */
const clearRefreshTokenCookie = (res: Response) => {
  res.setHeader(
    'Set-Cookie',
    'refreshToken=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax'
  );
};

/**
 * Registers a new user account and provisions a base profile.
 *
 * Validates the registration payload, ensures the username is unique, and creates
 * a corresponding empty profile (Player, Team, or Staff) based on the selected role.
 *
 * @param {Request} req - The Express request object containing registration details.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when registration succeeds or passes errors to next().
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password, role } = value;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({
          message: 'User already exists with this username'
        });
      }

      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Create User
    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    // Create a blank profile corresponding to the role
    if (role === 'player') {
      await new PlayerProfile({
        userID: user._id,
        position: 'Central Midfielder',
        preferredFoot: 'Both'
      }).save();
    } else if (role === 'team') {
      await new Team({
        userID: user._id,
        name: 'My Club',
        city: 'My City',
        email,
        recruiting: false
      }).save();
    } else if (role === 'staff') {
      await new StaffProfile({
        userID: user._id,
        roleDescription: 'Coach',
        isLookingForJob: true
      }).save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to DB
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt
    });
    // Set cookie and return
    setRefreshTokenCookie(res, refreshToken);
    res.status(201).json({
      message: 'Registration successful',
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
/**
 * Authenticates a user with a username and password.
 *
 * Verifies credentials, generates new access and refresh tokens, and
 * updates the refresh token in the database for the new session.
 *
 * @param {Request} req - The Express request object containing login credentials.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when login succeeds or passes errors to next().
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;

    // Find User
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check Password
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

    // Set cookie and return
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticates or registers a user via Google OAuth.
 *
 * Verifies the Google-provided ID token. If the user doesn't exist, provisions
 * a new account and profile (prompting for a role if missing). If the user
 * exists, links the Google ID if necessary and initiates a session.
 *
 * @param {Request} req - The Express request object containing the Google ID token and optional role.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when OAuth flow succeeds or passes errors to next().
 */
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = googleLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { idToken, role } = value;

    // Verify Google Token
    const googlePayload = await verifyGoogleToken(idToken);
    const { email, googleId, name } = googlePayload;

    // Find user by Google ID or Email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // If user does not exist, role is required to sign them up
      if (!role) {
        return res.status(200).json({ 
          needsRoleSelection: true, 
          email, 
          googleId, 
          message: 'Please specify user role to complete registration' 
        });
      }

      // Generate unique username from Google info
      let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!baseUsername) baseUsername = 'googleuser';
      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      // Create new user
      user = new User({ username, email, googleId, role });
      await user.save();

      // Create blank profile
      if (role === 'player') {
        await new PlayerProfile({ userID: user._id, position: 'Central Midfielder', preferredFoot: 'Both' }).save();
      } else if (role === 'team') {
        await new Team({ userID: user._id, name: name || 'My Club', city: 'My City', email: user.email || `${username}@scoutify.com`, recruiting: false }).save();
      } else if (role === 'staff') {
        await new StaffProfile({ userID: user._id, roleDescription: 'Coach', isLookingForJob: true }).save();
      }
    } else {
      // If user exists by email but doesn't have googleId linked, link it now
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      // If existing user has no username (e.g. legacy/seed users), generate one
      if (!user.username) {
        let baseUsername = user.email ? user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') : 'googleuser';
        let username = baseUsername;
        let counter = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }
        user.username = username;
        await user.save();
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

    // Set cookie and return
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      message: 'Google Login successful',
      accessToken,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Issues a new access token using a valid refresh token.
 *
 * Validates the refresh token from the cookie, checks against the database,
 * and detects potential token reuse (revoking all sessions if detected).
 * Implements refresh token rotation by issuing a new refresh token upon success.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when tokens are refreshed or passes errors to next().
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldToken = getRefreshTokenFromCookie(req);
    if (!oldToken) {
      return res.status(401).json({ message: 'Refresh token not found in cookies' });
    }

    // Find the refresh token in the DB
    const tokenRecord = await RefreshToken.findOne({ token: oldToken });
    
    // Verify the token content
    let decoded: any;
    try {
      decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret');
    } catch (err) {
      // If token is invalid or expired, clean up database record if it exists
      if (tokenRecord) {
        await RefreshToken.deleteOne({ token: oldToken });
      }
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // SECURITY: If token is verified but NOT found in DB, it may be a reuse attempt!
    if (!tokenRecord) {
      // Potential theft! Revoke all tokens for this user
      logger.warn(`Token reuse detected for userId ${decoded.id}! Revoking all sessions.`);
      await RefreshToken.deleteMany({ userId: decoded.id });
      clearRefreshTokenCookie(res);
      return res.status(403).json({ message: 'Potential token reuse detected. Please log in again.' });
    }

    // Find user to ensure they still exist and check their role
    const user = await User.findById(decoded.id);
    if (!user) {
      await RefreshToken.deleteOne({ token: oldToken });
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Generate new tokens (Rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Delete old refresh token, save new refresh token
    await RefreshToken.deleteOne({ token: oldToken });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: newRefreshToken, userId: user._id, expiresAt });

    // Set cookie and return new access token
    setRefreshTokenCookie(res, newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Logs out the authenticated user.
 *
 * Removes the refresh token from the database and clears the HTTP-only cookie.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when logout completes or passes errors to next().
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getRefreshTokenFromCookie(req);
    if (token) {
      // Delete from DB
      await RefreshToken.deleteOne({ token });
    }

    // Clear cookie
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
