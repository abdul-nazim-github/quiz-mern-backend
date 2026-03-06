import { body } from 'express-validator';
import { handleValidation } from './auth.validator';

// Topic CRUD Validator
export const topicValidator = [
  body('name').notEmpty().withMessage('Topic name is required').isString().isLength({ max: 255 }),
  body('status').optional().isBoolean().withMessage('Status must be a boolean'),
  handleValidation,
];
