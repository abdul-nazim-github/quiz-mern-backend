/**
 * Express Application Entry Point
 *
 * This file initializes the Express app, connects to MongoDB,
 * registers global middleware, and defines the primary route prefixes.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// ── Route Imports ──

// Student-facing API routes
import authRoutes from './routes/auth.routes';
import topicRoutes from './routes/topic.routes';
import quizRoutes from './routes/quiz.routes';

// Admin-panel routes
import adminTopicRoutes from './routes/admin/topic.admin.routes';
import adminQuestionRoutes from './routes/admin/question.admin.routes';
import adminUserRoutes from './routes/admin/user.admin.routes';
import adminTaskRoutes from './routes/admin/task.admin.routes';

import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';

// Load environment variables (.env)
dotenv.config();

const app = express();

// ── Global Middleware ──
app.use(cors());
app.use(express.json());  // Parses JSON bodies

/**
 * Swagger API Documentation
 * Mounts interactive docs at /api-docs.
 */
setupSwagger(app);

/**
 * Database Connection
 */
connectDB();

/**
 * ── Route Groups ──
 *
 * Separation between public student APIs and protected admin modules.
 */

// Student API (/api/*)
app.use('/api/auth', authRoutes);       // Authentication & session management
app.use('/api/topics', topicRoutes);    // Public topics list & question load
app.use('/api/quiz', quizRoutes);       // Submission & result histories

// Admin Panel (/admin/*)
app.use('/admin/topics', adminTopicRoutes);     // Topic CRUD
app.use('/admin/questions', adminQuestionRoutes); // Question CRUD
app.use('/admin/users', adminUserRoutes);         // User management
app.use('/admin/tasks', adminTaskRoutes);         // Task list with IP geo-location

// Health check endpoint for monitoring
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

/**
 * Global Error Handler
 *
 * MUST be defined last.
 * Prevents the app from crashing and ensures consistent error JSON.
 */
app.use(errorHandler);

const PORT = process.env.PORT || 5001; // Port 5001 avoids conflict with default macOS services
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
