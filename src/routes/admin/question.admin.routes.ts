import { Router } from 'express';
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../../controllers/question.controller';
import { protect } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/admin.middleware';
import { questionValidator } from '../../validators/question.validator';

const router = Router();

/**
 * Admin Question Management Routes
 */

/**
 * @swagger
 * tags:
 *   name: Admin - Questions
 */

/**
 * @swagger
 * /admin/questions:
 *   get:
 *     summary: Get questions (Admin)
 *     tags: [Admin - Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *         description: Filter by Topic ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 */
router.get('/', protect, adminOnly, getQuestions);

/**
 * @swagger
 * /admin/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Admin - Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - topic
 *               - type
 *               - options
 *               - answer
 *             properties:
 *               title:
 *                 type: string
 *               topic:
 *                 type: string
 *                 description: Topic ID
 *               type:
 *                 type: string
 *                 enum: [radio, checkbox, input, textarea]
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               answer:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: string
 *               required:
 *                 type: boolean
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Question created successfully
 */
router.post('/', protect, adminOnly, ...questionValidator, createQuestion);

/**
 * @swagger
 * /admin/questions/{id}:
 *   get:
 *     summary: Get single question details
 *     tags: [Admin - Questions]
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
 *         description: Question details fetched successfully
 */
router.get('/:id', protect, adminOnly, getQuestion);

/**
 * @swagger
 * /admin/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Admin - Questions]
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
 *               title:
 *                 type: string
 *               topic:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [radio, checkbox, input, textarea]
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               answer:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: string
 *               required:
 *                 type: boolean
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Question updated successfully
 */
router.put('/:id', protect, adminOnly, ...questionValidator, updateQuestion);

/**
 * @swagger
 * /admin/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Admin - Questions]
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
 *         description: Question deleted successfully
 */
router.delete('/:id', protect, adminOnly, deleteQuestion);

export default router;
