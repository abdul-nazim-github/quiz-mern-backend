import { body } from 'express-validator';
import { handleValidation } from './auth.validator';

// Task CRUD Validator
export const taskValidator = [
  body('title').notEmpty().withMessage('Title is required').isString().isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isBoolean().withMessage('Status must be a boolean'),
  body('address').notEmpty().withMessage('Address is required').isString(),
  body('user_id').notEmpty().withMessage('User ID is required').isMongoId().withMessage('User ID must be a valid MongoDB ID'),
  handleValidation,
];
