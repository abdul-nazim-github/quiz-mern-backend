/**
 * Response Utility
 *
 * Standardizes API responses across the application.
 * Ensures a consistent 'success', 'message', and 'data/error' envelope.
 */

import { Response } from 'express';

/**
 * sendSuccess
 *
 * Standard wrapper for HTTP 200/201 responses.
 */
export const sendSuccess = (
  res: Response,
  message: string,
  data?: unknown,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * sendError
 *
 * Standard wrapper for HTTP 4xx/5xx responses.
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  error?: unknown
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  });
};
