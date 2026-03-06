import { body } from 'express-validator';
import { handleValidation } from './auth.validator';

// POST /admin/users
export const userValidator = [
  body('name').notEmpty().withMessage('Name is required').isString().isLength({ max: 255 }),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('status').optional().isIn([0, 1]).withMessage('Status must be 0 or 1'),
  handleValidation,
];

// PUT /admin/users/:id
export const updateUserValidator = [
  body('name').optional().isString().isLength({ max: 255 }),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  body('status').optional().isIn([0, 1]).withMessage('Status must be 0 or 1'),
  handleValidation,
];
