import { Router } from 'express';
import {
  refreshTokenController,
  loginController,
  logoutController,
} from '../controllers/authController';
import { validateRequestBody } from '../middlewares/validationMiddlware';

import { isAuthenticated } from '../middlewares/authMiddleware';
import { SignInSchema } from '../validations/authSchema';
import { loginLimiter } from '../common/utils/loginLimitter';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateRequestBody(SignInSchema),
  loginController
);
router.post('/logout', isAuthenticated, logoutController);
router.post('/refresh-token', refreshTokenController);

export default router;
