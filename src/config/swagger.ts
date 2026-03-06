import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz App API Documentation',
      version: '1.0.0',
      description: 'API documentation for the MERN Quiz Application.',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'User - Auth', description: 'Student & General User Authentication' },
      { name: 'User - Topics', description: 'Publicly accessible quiz categories for students' },
      { name: 'User - Quiz', description: 'Student quiz attempts, scoring, and history' },
      { name: 'Admin - Topics', description: 'Management of quiz categories (Admin Restricted)' },
      { name: 'Admin - Questions', description: 'Management of quiz questions (Admin Restricted)' },
      { name: 'Admin - Users', description: 'Management of user accounts and roles (Admin Restricted)' },
      { name: 'Admin - Tasks', description: 'Task management and tracking (Admin/User restricted)' },
    ],
  },
  apis: ['./src/routes/*.routes.ts', './src/routes/admin/*.admin.routes.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📖 API Documentation available at http://localhost:5001/api-docs');
};
