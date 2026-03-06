import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/user.controller';
import { protect } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/admin.middleware';
import { roleGuard } from '../../middleware/role.middleware';
import { userValidator, updateUserValidator } from '../../validators/user.validator';

const router = Router();

/**
 * Admin User Management Routes
 */

/**
 * @swagger
 * tags:
 *   name: Admin - Users
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin/Self)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get('/', protect, roleGuard('admin', 'user'), getUsers);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user (Public)
 *     tags: [Admin - Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', ...userValidator, createUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Admin - Users]
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
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               status:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', protect, roleGuard('admin', 'user'), ...updateUserValidator, updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin)
 *     tags: [Admin - Users]
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
 *         description: User deleted successfully
 */
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
