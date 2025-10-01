import { Router } from 'express';
import { validateRequestBody } from '../middlewares/validationMiddlware';
import { hasRole, isAuthenticated } from '../middlewares/authMiddleware';
import { CreateUserSchema } from '../validations/userSchema';
import { createUserController } from '../controllers/userController';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  hasRole(['Admin']),
  validateRequestBody(CreateUserSchema),
  createUserController
);

export default router;
