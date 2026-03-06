/**
 * Question Controller
 *
 * Manages the Quiz Questions for the Admin panel.
 */

import { Request, Response } from 'express';
import Question from '../models/Question.model';
import { sendSuccess, sendError } from '../utils/response';

/**
 * Get Questions (Admin)
 * GET /admin/questions?topic=<topicId>&page=1
 *
 * Logic:
 * - Filtering: Optionally filters questions by Topic ID.
 * - Pagination: Manual calculation using .skip() and .limit().
 * - Population: Loads Topic names for display.
 */
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, page = 1, limit = 10 } = req.query;
    const filter: Record<string, unknown> = {};

    if (topic) filter.topic = topic;

    const questions = await Question.find(filter)
      .populate('topic', 'name')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Question.countDocuments(filter);

    sendSuccess(res, 'Questions fetched successfully', {
      questions,
      pagination: {
        total,
        page: +page,
        limit: +limit,
        pages: Math.ceil(total / +limit),
      },
    });
  } catch (error) {
    sendError(res, 'Failed to fetch questions', 500, error);
  }
};

/**
 * Get Single Question Details
 * GET /admin/questions/:id
 */
export const getQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id).populate('topic');

    if (!question) {
      sendError(res, 'Question not found', 404);
      return;
    }

    sendSuccess(res, 'Question fetched successfully', question);
  } catch (error) {
    sendError(res, 'Failed to fetch question', 500, error);
  }
};

/**
 * Create Question
 * POST /admin/questions
 *
 * Logic: Inserts a new question into a topic.
 * Field types (radio, checkbox, etc.) dictate how 'options' and 'answer' are used.
 */
export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, topic, type, options, answer, required, status } = req.body;

    const question = await Question.create({
      title,
      topic,
      type,
      options: options ?? [],
      answer: answer ?? [],
      required: required ?? true,
      status: status ?? true,
    });

    sendSuccess(res, 'Question created successfully', question, 201);
  } catch (error) {
    sendError(res, 'Failed to create question', 500, error);
  }
};

/**
 * Update Question
 * PUT /admin/questions/:id
 */
export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, topic, type, options, answer, required, status } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { title, topic, type, options, answer, required, status },
      { new: true, runValidators: true } // Returns the fresh updated document
    );

    if (!question) {
      sendError(res, 'Question not found', 404);
      return;
    }

    sendSuccess(res, 'Question updated successfully', question);
  } catch (error) {
    sendError(res, 'Failed to update question', 500, error);
  }
};

/**
 * Delete Question
 * DELETE /admin/questions/:id
 */
export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      sendError(res, 'Question not found', 404);
      return;
    }

    sendSuccess(res, 'Question deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete question', 500, error);
  }
};
