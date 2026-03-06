/**
 * Task Controller
 *
 * Manages user tasks.
 */

import { Request, Response } from 'express';
import Task from '../models/Task.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Get Tasks
 * GET /admin/tasks
 *
 * Logic:
 * - Admin: Sees all tasks in the system.
 * - Regular User: Sees only their own tasks.
 */
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user?.isAdmin() ? {} : { user: req.user?._id };

    const tasks = await Task.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Tasks fetched successfully', tasks);
  } catch (error) {
    sendError(res, 'Failed to fetch tasks', 500, error);
  }
};

/**
 * Create Task
 * POST /admin/tasks
 *
 * Logic:
 * 1. Checks for Duplicate Title: Uses a case-insensitive regex to ensure
 *    the user doesn't already have a task with the same name.
 * 2. Creates the document.
 * Includes 'address' which is often auto-filled by the frontend/middleware.
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, address, user_id } = req.body;

    // Case-insensitive uniqueness check per user
    const existing = await Task.findOne({
      user: user_id,
      title: { $regex: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (existing) {
      sendError(res, 'Task title already exists for this user', 400);
      return;
    }

    const task = await Task.create({
      title,
      description: description ?? null,
      status: status ?? false,
      address,
      user: user_id,
    });

    sendSuccess(res, 'Task created successfully!', task, 201);
  } catch (error) {
    sendError(res, 'Failed to create task', 500, error);
  }
};

/**
 * Update Task
 * PUT /admin/tasks/:id
 *
 * Logic:
 * - Verifies the new title is not taken by another task owned by the same user.
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, address, user_id } = req.body;
    const taskId = req.params.id;

    // Case-insensitive unique check excluding current ID ($ne = not equal)
    const existing = await Task.findOne({
      _id: { $ne: taskId } as any,
      user: user_id,
      title: { $regex: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (existing) {
      sendError(res, 'Task title already exists for this user', 400);
      return;
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, address, user: user_id },
      { new: true }
    );

    if (!task) {
      sendError(res, 'Task not found', 404);
      return;
    }

    sendSuccess(res, 'Task updated successfully!', task);
  } catch (error) {
    sendError(res, 'Failed to update task', 500, error);
  }
};

/**
 * Delete Task
 * DELETE /admin/tasks/:id
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      sendError(res, 'Task not found', 404);
      return;
    }

    sendSuccess(res, 'Task deleted successfully!');
  } catch (error) {
    sendError(res, 'Failed to delete task', 500, error);
  }
};
