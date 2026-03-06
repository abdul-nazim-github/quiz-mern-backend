import { body } from 'express-validator';
import { handleValidation } from './auth.validator';

// Question CRUD Validator
export const questionValidator = [
  body('title').notEmpty().withMessage('Question title is required').isString(),
  body('topic').notEmpty().withMessage('Topic is required').isMongoId().withMessage('Topic must be a valid ID'),
  body('type').notEmpty().withMessage('Type is required').isIn(['input', 'textarea', 'radio', 'checkbox']).withMessage('Type must be input, textarea, radio, or checkbox'),
  body('options').optional().isArray().withMessage('Options must be an array'),
  body('answer').optional().isArray().withMessage('Answer must be an array'),
  body('required').optional().isBoolean().withMessage('Required must be a boolean'),
  body('status').optional().isBoolean().withMessage('Status must be a boolean'),
  handleValidation,
];
