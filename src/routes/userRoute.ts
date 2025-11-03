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
} from '../middlewares/validationMiddleware';
import { hasRole } from '../middlewares/authMiddleware';
import {
  CreateUserSchema,
  UpdateUserSchema,
  GetUserParamSchema,
  GetAllUsersQuerySchema,
} from '../validations/userSchema';

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieves all users (Admin & Staff only)
 *     description: Retrieves a list of all users with pagination and filtering support. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/RoleFilterParam'
 *       - $ref: '#/components/parameters/ActiveFilterParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedUsersResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllUsersQuerySchema),
  getAllUsersController
);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (Admin only)
 *     description: Retrieve a specific user by their ID. Accessible only to Admin users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetUserSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  getUserController
);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user (Admin & Staff only)
 *     description: Create a new user. Only accessible by Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateUserRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateUserSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateUserSchema),
  createUserController
);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID (Admin & Staff only)
 *     description: Update user information. Accessible to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateUserRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateUserSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  validateRequestBody(UpdateUserSchema),
  updateUserController
);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID (Admin & Staff only)
 *     description: Delete a user account. Accessible to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteUserSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:userId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetUserParamSchema),
  deleteUserController
);

export default router;
