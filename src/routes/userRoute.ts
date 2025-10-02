import { Router } from 'express';
import {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '../controllers/userController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import { hasRole } from '../middlewares/authMiddleware';
import {
  CreateUserSchema,
  GetUserParamSchema,
  GetUserQuerySchema,
} from '../validations/userSchema';

const router = Router();

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetUserQuerySchema),
  getAllUsersController
);
router.get(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  getUserController
);
router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateUserSchema),
  createUserController
);
router.put(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  validateRequestBody(CreateUserSchema),
  updateUserController
);
router.delete(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  deleteUserController
);

export default router;
