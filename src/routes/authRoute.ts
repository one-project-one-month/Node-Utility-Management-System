import { Router } from 'express';
import {
  refreshTokenController,
  loginController,
  logoutController,
} from '../controllers/authController';
import { validateRequestBody } from '../middlewares/validationMiddlware';

import { isAuthenticated } from '../middlewares/authMiddleware';
import { LoginSchema } from '../validations/authSchema';
import { loginLimiter } from '../common/utils/loginLimitter';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateRequestBody(LoginSchema),
  loginController
);
router.post('/logout', isAuthenticated, logoutController);
router.post('/refresh-token', refreshTokenController);

export default router;
