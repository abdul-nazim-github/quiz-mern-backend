import { Router } from 'express';
import {
  getAllTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../../controllers/topic.controller';
import { protect } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/admin.middleware';
import { topicValidator } from '../../validators/topic.validator';

const router = Router();

/**
 * Admin Topic Management Routes
 */

/**
 * @swagger
 * tags:
 *   name: Admin - Topics
 */

/**
 * @swagger
 * /admin/topics:
 *   get:
 *     summary: Get all topics (Admin)
 *     tags: [Admin - Topics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All topics fetched successfully
 */
router.get('/', protect, adminOnly, getAllTopics);

/**
 * @swagger
 * /admin/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Admin - Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Topic created successfully
 */
router.post('/', protect, adminOnly, ...topicValidator, createTopic);

/**
 * @swagger
 * /admin/topics/{id}:
 *   put:
 *     summary: Update a topic
 *     tags: [Admin - Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Topic updated successfully
 */
router.put('/:id', protect, adminOnly, ...topicValidator, updateTopic);

/**
 * @swagger
 * /admin/topics/{id}:
 *   delete:
 *     summary: Delete a topic
 *     tags: [Admin - Topics]
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
 *         description: Topic deleted successfully
 */
router.delete('/:id', protect, adminOnly, deleteTopic);

export default router;
