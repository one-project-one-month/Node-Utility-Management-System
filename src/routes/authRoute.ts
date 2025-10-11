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

router.post(
  '/login',
  loginLimiter,
  validateRequestBody(LogInSchema),
  loginController
);
router.post('/logout', isAuthenticated, logoutController);
router.post('/refresh-token', refreshTokenController);

export default router;
