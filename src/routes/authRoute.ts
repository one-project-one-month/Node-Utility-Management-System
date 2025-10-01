import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
} from "../controllers/authController";
import {
  validateRequestBody,
} from "../middlewares/validationMiddlware";

import {verifyToken} from "../middlewares/authMiddleware"
import { LoginSchema } from "../validations/authSchema";
import { loginLimiter } from "../common/utils/loginLimitter";

const router = Router();

router.post("/login", validateRequestBody(LoginSchema),loginLimiter, loginController);
router.post("/logout", verifyToken, logoutController);
router.post("/refresh-token", refreshController);

export default router;

