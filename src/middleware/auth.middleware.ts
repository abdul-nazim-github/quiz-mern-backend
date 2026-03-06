/**
 * Auth Middleware (Protect)
 *
 * Intercepts requests to protected routes and verifies the JWT.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';

/**
 * Custom Request Type
 * Extends standard Express Request to include the 'user' object once authenticated.
 */
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * protect Middleware
 *
 * Logic:
 * 1. Checks for 'Authorization: Bearer <token>' header.
 * 2. Decodes the token using JWT_SECRET.
 * 3. Fetches the User from DB to ensure they still exist and are active (status: 1).
 * 4. Attaches the User object to req.user for use in controllers.
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user || user.status !== 1) {
      res.status(401).json({ success: false, message: 'Unauthorized or inactive account' });
      return;
    }

    req.user = user; // Makes the authenticated user available globally in this request
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
