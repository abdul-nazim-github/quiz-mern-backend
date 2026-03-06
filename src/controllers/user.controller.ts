/**
 * User Controller
 *
 * Manages user CRUD operations and profile management.
 */

import { Request, Response } from 'express';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Get Users
 * GET /admin/users
 *
 * Logic:
 * - Admin: Sees all users in the system.
 * - Regular User: Only sees their own information (filtered by _id).
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user?.isAdmin() ? {} : { _id: req.user?._id };
    const users = await User.find(filter).sort({ created_at: -1 });
    sendSuccess(res, 'Users fetched successfully', users);
  } catch (error) {
    sendError(res, 'Failed to fetch users', 500, error);
  }
};

/**
 * Create User (Admin only)
 * POST /admin/users
 *
 * Logic:
 * 1. Checks for email uniqueness.
 * 2. Creates the user record.
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, status } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, 'Email already registered', 400);
      return;
    }

    const user = await User.create({
      name,
      email,
      password,          // Password hashing is automated in User.model.ts pre-save hook
      role: 'user',      // Always default to 'user' for new registrations
      status: status ?? 1,
    });

    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (userObj as any).password;

    sendSuccess(res, 'User created successfully', userObj, 201);
  } catch (error) {
    sendError(res, 'Failed to create user', 500, error);
  }
};

/**
 * Update User
 * PUT /admin/users/:id
 *
 * Logic:
 * - Permission Check: Admins can update any ID. Non-admins are forced to their own ID.
 * - findByIdAndUpdate: Updates specific fields and returns the new document.
 * Includes partial updates (fields not in body are ignored by Mongoose).
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetId = req.user?.isAdmin() ? req.params.id : req.user?._id?.toString();
    const { name, email, role, status } = req.body;

    // Prepare update object
    const updateData: any = { name, email, status };

    // Role Security: Only admins can change roles
    if (req.user?.isAdmin() && role) {
      updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(
      targetId,
      updateData,
      { new: true, runValidators: true } // new: true returns the updated document instead of the old one
    );

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'User updated successfully', user);
  } catch (error) {
    sendError(res, 'Failed to update user', 500, error);
  }
};

/**
 * Delete User (Admin only)
 * DELETE /admin/users/:id
 *
 * Logic: Removes the user document from the database.
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete user', 500, error);
  }
};
