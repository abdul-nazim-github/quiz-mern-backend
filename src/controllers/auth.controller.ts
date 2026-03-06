/**
 * Auth Controller
 *
 * Handles user authentication, registration, and session management.
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Utility: Generate JWT
 *
 * Creates a signed token for the user.
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d',
  });
};

/**
 * User Registration
 * POST /api/auth/register
 *
 * Logic:
 * 1. Normalize email to lowercase.
 * 2. Check for existing email to prevent duplicates.
 * 3. Create user (Mongoose pre-save hook handles password hashing).
 * 4. Generate token and return user data (safe object without password).
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, status } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      sendError(res, 'Email already registered', 400);
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user', // Default role is always 'user'
      status: status ?? 1,
    });

    const token = generateToken(user._id.toString());

    // Security: Convert to plain JS object and purge password field
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (userObj as any).password;

    sendSuccess(res, 'User registered successfully!', { user: userObj, access_token: token }, 201);
  } catch (error) {
    sendError(res, 'Registration failed', 400, error);
  }
};

/**
 * User Login
 * POST /api/auth/login
 *
 * Logic:
 * 1. Find user by email (only if active).
 * 2. Manually select password field since it's hidden by default in schema.
 * 3. Compare hashed password using user.comparePassword().
 * 4. Generate and return JWT.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password — select('+password') overrides the hidden schema flag
    const user = await User.findOne({ email: email.toLowerCase(), status: 1 }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'The provided credentials do not match our records.', 400);
      return;
    }

    const token = generateToken(user._id.toString());

    // Mask password from final response
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (userObj as any).password;

    sendSuccess(res, 'Login successful!', { user: userObj, access_token: token });
  } catch (error) {
    sendError(res, 'Login failed', 400, error);
  }
};

/**
 * User Logout
 * POST /api/auth/logout
 *
 * NOTE: Since JWT is stateless, 'logout' primarily happens on the client
 * (by deleting the token). This endpoint returns a success response for cleanup.
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, 'Logged out successfully!');
  } catch (error) {
    sendError(res, 'Logout failed', 401, error);
  }
};
