import { Router } from "express";
import {
  refreshTokenController,
  signInController,
  signOutController,
} from '../controllers/authController';
import {
  validateRequestBody,
} from "../middlewares/validationMiddlware";

import { isAuthenticated } from '../middlewares/authMiddleware';
import { SignInSchema } from "../validations/authSchema";
import { loginLimiter } from "../common/utils/loginLimitter";

const router = Router();

router.post("/signin", validateRequestBody(SignInSchema), loginLimiter, signInController);
router.post("/signout", isAuthenticated, signOutController);
router.post("/refresh-token", refreshTokenController);

export default router;

