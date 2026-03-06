import { Router } from 'express';
import {
  saveQuiz,
  getQuizResult,
  getQuizList,
  getQuizDetail,
} from '../controllers/quiz.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * Quiz & Result Routes
 */

/**
 * @swagger
 * tags:
 *   name: User - Quiz
 */

/**
 * @swagger
 * /api/quiz:
 *   get:
 *     summary: Get user's quiz history
 *     tags: [User - Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz history fetched successfully
 */
router.get('/', protect, getQuizList);

/**
 * @swagger
 * /api/quiz/save:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [User - Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - topic_id
 *               - question_answer
 *             properties:
 *               user_id:
 *                 type: string
 *               topic_id:
 *                 type: string
 *               question_answer:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Question ID
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                         - type: array
 *                           items:
 *                             type: string
 *     responses:
 *       200:
 *         description: Quiz results saved successfully
 */
router.post('/save', protect, saveQuiz);

/**
 * @swagger
 * /api/quiz/result:
 *   get:
 *     summary: Get score summary for a quiz result
 *     tags: [User - Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 */
router.get('/result', protect, getQuizResult);

/**
 * @swagger
 * /api/quiz/{id}/detail:
 *   get:
 *     summary: Get detailed breakdown of a quiz attempt
 *     tags: [User - Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed results fetched successfully
 */
router.get('/:id/detail', protect, getQuizDetail);

export default router;
