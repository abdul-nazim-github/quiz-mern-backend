import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Reusable validation error handler (returns 422 on failure)
export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

// POST /api/auth/register
export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required').isString().isLength({ max: 255 }),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('status').optional().isIn([0, 1]).withMessage('Status must be 0 or 1'),
  handleValidation,
];

// POST /api/auth/login
export const loginValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];
