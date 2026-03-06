/**
 * Admin Middleware
 *
 * Restricted access to administrative routes.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * adminOnly Middleware
 *
 * Logic:
 * Checks if 'req.user' (attached by protect middleware) exists
 * and has the 'admin' role.
 */
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access only' });
    return;
  }
  next();
};
