/**
 * Topic Controller
 *
 * Handles quiz categories (Topics).
 */

import { Request, Response } from 'express';
import Topic from '../models/Topic.model';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Get Public Topics
 * GET /api/topics
 *
 * Returns a simplified list of topics for students to choose from.
 */
export const getTopics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics = await Topic.find({}, { name: 1 }); // Projection: Only include name and _id
    sendSuccess(res, 'Topics fetched successfully', topics);
  } catch (error) {
    sendError(res, 'Failed to fetch topics', 500, error);
  }
};

/**
 * Get Topic Details (with Questions)
 * GET /api/topics/:id
 *
 * Used for the quiz play page.
 * Logic:
 * - findById: Finds the topic.
 * - .populate('questions'): Loads child questions using Mongoose virtuals.
 * - Projections: Specifically removes 'answer' field so students can't cheat via API inspection.
 */
export const getTopicDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate({
        path: 'questions',
        match: { status: true },    // Only load active questions
        select: 'title type required options status', // Excludes 'answer' for security
      });

    if (!topic) {
      sendError(res, 'Topic not found', 404);
      return;
    }

    sendSuccess(res, 'Topic details fetched successfully', topic);
  } catch (error) {
    sendError(res, 'Failed to fetch topic details', 500, error);
  }
};

/**
 * Admin: Get All Topics
 * GET /admin/topics
 *
 * Returns full data for all topics including status.
 */
export const getAllTopics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    sendSuccess(res, 'Topics fetched successfully', topics);
  } catch (error) {
    sendError(res, 'Failed to fetch topics', 500, error);
  }
};

/**
 * Admin: Create Topic
 * POST /admin/topics
 *
 * Logic: Creates a new category.
 * Error Handling: Specifically catches MongoDB duplicate key error (11000) for 'name'.
 */
export const createTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    const topic = await Topic.create({ name, status });
    sendSuccess(res, 'Topic created successfully', topic, 201);
  } catch (error: unknown) {
    // 11000 = MongoDB Duplicate Key (for unique 'name' field)
    if ((error as { code?: number }).code === 11000) {
      sendError(res, 'Topic name already exists', 400);
      return;
    }
    sendError(res, 'Failed to create topic', 500, error);
  }
};

/**
 * Admin: Update Topic
 * PUT /admin/topics/:id
 */
export const updateTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, status } = req.body;

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name, status },
      { new: true, runValidators: true }
    );

    if (!topic) {
      sendError(res, 'Topic not found', 404);
      return;
    }

    sendSuccess(res, 'Topic updated successfully', topic);
  } catch (error) {
    sendError(res, 'Failed to update topic', 500, error);
  }
};

/**
 * Admin: Delete Topic
 * DELETE /admin/topics/:id
 *
 * Logic: Permanently removes the topic.
 */
export const deleteTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      sendError(res, 'Topic not found', 404);
      return;
    }

    sendSuccess(res, 'Topic deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete topic', 500, error);
  }
};
