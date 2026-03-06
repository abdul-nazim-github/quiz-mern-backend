/**
 * Role Guard Middleware
 *
 * Flexible middleware to allow single or multiple roles (e.g., admin + user).
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * roleGuard Higher-Order Function
 *
 * Returns a middleware function that checks if the authenticated user
 * has any of the permitted roles.
 *
 * Usage: router.get('/', protect, roleGuard('admin', 'user'), controller)
 */
export const roleGuard = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Check if the user's role exists in the provided roles array
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
      return;
    }

    next();
  };
};
