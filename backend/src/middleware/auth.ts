/**
 * @module auth
 *
 * Express authentication and authorization middleware for Scoutify.
 * Provides JWT Bearer token validation, request payload hydration, and
 * role-based access control (RBAC) route guards.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Shape of the decoded JWT payload representing authenticated user claims.
 */
export interface IUserPayload {
  /** Unique database identifier for the user. */
  id: string;
  /** Username of the authenticated user. */
  username: string;
  /** Email address of the user (optional for OAuth accounts). */
  email?: string;
  /** Platform role assigned to the user ('player', 'team', or 'staff'). */
  role: 'player' | 'team' | 'staff';
}

/**
 * Express Request interface extended to include decoded user authentication payload.
 */
export interface AuthenticatedRequest extends Request {
  /** Decoded JWT claims attached upon successful authentication. */
  user?: IUserPayload;
}

/**
 * Express middleware to validate incoming JWT Bearer tokens.
 *
 * Inspects the `Authorization` header, verifies the signature against the secret key,
 * and attaches the decoded user payload to `req.user`. Returns structured HTTP 401/403
 * responses if missing, expired, or invalid.
 *
 * @param  {AuthenticatedRequest}  req   Express request object extended with user property.
 * @param  {Response}              res   Express response object.
 * @param  {NextFunction}          next  Express next middleware callback.
 * @returns {void | Response}      Passes execution to next middleware or sends HTTP error.
 */
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Enforce Authorization header with Bearer scheme
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify token signature and decode user claims
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret') as IUserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    // Return specific code for expired tokens to allow frontend token refresh flows
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ message: 'Invalid or malformed token' });
  }
};

/**
 * Middleware factory for role-based authorization control (RBAC).
 *
 * Creates a middleware function that ensures the authenticated user's role
 * is included in the allowed roles list. Must be chained after `authenticateJWT`.
 *
 * @param  {...Array<'player' | 'team' | 'staff'>}  roles  Allowed roles for the protected route.
 * @returns {(req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response} Express middleware handler.
 *
 * @example
 * app.get('/staff/reports', authenticateJWT, authorizeRoles('staff'), getReports);
 */
export const authorizeRoles = (...roles: Array<'player' | 'team' | 'staff'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Ensure authentication middleware was executed prior to authorization check
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    // Deny access if user role is not within the authorized roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
