import { Router } from 'express';
import { validateRequestBody } from '../middlewares/validationMiddlware';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { SignInSchema } from '../validations/authSchema';
import {
  refreshTokenController,
  signInController,
  signOutController,
} from '../controllers/authController';

const router = Router();

router.post('/signin', validateRequestBody(SignInSchema), signInController);
router.post('/refresh-token', refreshTokenController);
router.post('/signout', isAuthenticated, signOutController);

export default router;
