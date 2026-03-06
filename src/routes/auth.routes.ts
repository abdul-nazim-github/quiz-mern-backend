import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

/**
 * Auth Routes
 */

/**
 * @swagger
 * tags:
 *   name: User - Auth
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User - Auth]
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
 *         description: Registered successfully
 */
router.post('/register', ...registerValidator, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [User - Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', ...loginValidator, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [User - Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', protect, logout);

export default router;
