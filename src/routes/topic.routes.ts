import { Router } from 'express';
import { getTopics, getTopicDetails } from '../controllers/topic.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * Public Topic Routes
 */

/**
 * @swagger
 * tags:
 *   name: User - Topics
 */

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Get all topics
 *     tags: [User - Topics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics fetched successfully
 */
router.get('/', protect, getTopics);

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Get topic details and questions
 *     tags: [User - Topics]
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
 *         description: Topic details fetched successfully
 */
router.get('/:id', protect, getTopicDetails);

export default router;
