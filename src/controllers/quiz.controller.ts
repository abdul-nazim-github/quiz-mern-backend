/**
 * Quiz Controller
 *
 * Handles the logic for students taking quizzes and viewing their results.
 *
 * Logic includes answer comparisons (comparing Strings/Arrays) and scoring.
 */

import { Request, Response } from 'express';
import Question from '../models/Question.model';
import QuizResult from '../models/QuizResult.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { compareAnswers } from '../utils/quizHelper';

/**
 * Submit Quiz
 * POST /api/quiz/save
 *
 * Logic:
 * 1. Takes user_id, topic_id, and an array of question_answer objects.
 * 2. Validates that all question IDs provided exist in the database.
 * 3. Records the submission in the QuizResult model.
 */
export const saveQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { user_id, topic_id, question_answer } = req.body;

    if (!Array.isArray(question_answer)) {
      sendError(res, 'question_answer must be an array', 400);
      return;
    }

    const questionIds = question_answer.map((qa: { id: string }) => qa.id);
    const validQuestions = await Question.find({ _id: { $in: questionIds } });

    if (validQuestions.length !== questionIds.length) {
      sendError(res, 'One or more question IDs are invalid', 400);
      return;
    }

    const quiz = await QuizResult.create({
      user: user_id,
      topic: topic_id,
      question_answer,
    });

    sendSuccess(res, 'Quiz stored successfully', quiz);
  } catch (error) {
    sendError(res, 'Failed to store quiz', 500, error);
  }
};

/**
 * Get Quiz Summary
 * GET /api/quiz/result?id=<quizResultId>
 *
 * Logic:
 * 1. Find the Result record.
 * 2. Fetch correct answers for all questions in that topic.
 * 3. Loop through user's answers and compare with correct answers.
 * 4. Return summary counts (Total, Attempted, Correct).
 */
export const getQuizResult = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const quizResult = await QuizResult.findById(id as string);

    if (!quizResult) {
      sendError(res, 'No quiz result found', 404);
      return;
    }

    const topicId = quizResult.topic;
    const totalQuestions = await Question.countDocuments({ topic: topicId, status: true });

    const userAnswers = quizResult.question_answer ?? [];
    const totalAttempt = userAnswers.length;

    const topicQuestions = await Question.find({ topic: topicId });
    const questionsMap = new Map(topicQuestions.map((q) => [q._id.toString(), q]));

    let correctAnswersCount = 0;

    /**
     * Scoring Algorithm
     * Compares String to String (for input/radio)
     * Compares Sorted Arrays to Sorted Arrays (for checkboxes)
     */
    for (const userAnswerItem of userAnswers) {
      const question = questionsMap.get(userAnswerItem.id);
      if (!question) continue;

      if (compareAnswers(question.answer, userAnswerItem.answer)) {
        correctAnswersCount++;
      }
    }

    sendSuccess(res, 'Quiz result fetched successfully', {
      total_questions: totalQuestions,
      total_attempt: totalAttempt,
      correct_answer: correctAnswersCount,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch quiz result', 500, error);
  }
};

/**
 * Get My Results List
 * GET /api/quiz
 *
 * Logic:
 * - Admin: Sees every result in the system.
 * - User: Only sees their own results.
 * Loads User and Topic info via .populate().
 */
export const getQuizList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user?.isAdmin() ? {} : { user: req.user?._id };

    const results = await QuizResult.find(filter)
      .populate('user', 'name email')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Quiz results fetched successfully', results);
  } catch (error) {
    sendError(res, 'Failed to fetch quiz results', 500, error);
  }
};

/**
 * Get Detailed Result breakdown
 * GET /api/quiz/:id/detail
 *
 * Logic:
 * - Calculates percentage and counts.
 * - Map's every question with the user's specific choice and whether it was correct.
 */
export const getQuizDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quizResult = await QuizResult.findById(req.params.id)
      .populate('user', 'name email')
      .populate('topic', 'name');

    if (!quizResult) {
      sendError(res, 'Quiz result not found', 404);
      return;
    }

    const topicId = quizResult.topic;
    const userAnswers = quizResult.question_answer ?? [];
    const questions = await Question.find({ topic: topicId });

    const totalQuestions = questions.length;
    const totalAttempt = userAnswers.length;
    let correctAnswersCount = 0;

    const detailedQuestions = questions.map((question) => {
      const userAnswerItem = userAnswers.find((ua) => ua.id === question._id.toString());
      const userAnswerRaw = userAnswerItem?.answer ?? null;
      const isCorrect = compareAnswers(question.answer, userAnswerRaw);

      if (isCorrect) correctAnswersCount++;

      return {
        question,
        user_answer: userAnswerRaw,
        is_correct: isCorrect,
      };
    });

    const wrongAnswersCount = totalAttempt - correctAnswersCount;
    const percentage =
      totalQuestions > 0
        ? parseFloat(((correctAnswersCount / totalQuestions) * 100).toFixed(2))
        : 0;

    sendSuccess(res, 'Quiz detail fetched successfully', {
      quizResult,
      totalQuestions,
      totalAttempt,
      correctAnswersCount,
      wrongAnswersCount,
      percentage,
      detailedQuestions,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch quiz detail', 500, error);
  }
};
