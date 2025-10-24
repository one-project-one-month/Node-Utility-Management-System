import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshTokenController,
} from '../controllers/authController';
import { validateRequestBody } from '../middlewares/validationMiddlware';

import { isAuthenticated } from '../middlewares/authMiddleware';
import { LogInSchema } from '../validations/authSchema';

import { loginLimiter } from '../common/utils/loginLimitter';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign in a user
 *     description: Sign in a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LoginSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/login',
  loginLimiter,
  validateRequestBody(LogInSchema),
  loginController
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign out a user
 *     description: Sign out the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LogoutSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/logout', isAuthenticated, logoutController);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: Refresh the access token using a valid refresh token stored in a cookie
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         description: Refresh token stored in HTTP-only cookie
 *         required: false
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         $ref: '#/components/responses/RefreshTokenSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/refresh-token', refreshTokenController);

export default router;
