import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../controllers/task.controller';
import { protect } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/admin.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { taskValidator } from '../../validators/task.validator';

const router = Router();

/**
 * Task Management Routes
 */

/**
 * @swagger
 * tags:
 *   name: Admin - Tasks
 */

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Get all tasks (Admin/Self)
 *     tags: [Admin - Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 */
router.get('/', protect, roleGuard('admin', 'user'), getTasks);

/**
 * @swagger
 * /admin/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Admin - Tasks]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *               address:
 *                 type: string
 *               user:
 *                 type: string
 *                 description: User ID (Falls back to auth user if not provided)
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', protect, roleGuard('admin', 'user'), ...taskValidator, createTask);

/**
 * @swagger
 * /admin/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Admin - Tasks]
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
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:id', protect, roleGuard('admin', 'user'), ...taskValidator, updateTask);

/**
 * @swagger
 * /admin/tasks/{id}:
 *   delete:
 *     summary: Delete a task (Admin)
 *     tags: [Admin - Tasks]
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
 *         description: Task deleted successfully
 */
router.delete('/:id', protect, adminOnly, deleteTask);

export default router;
