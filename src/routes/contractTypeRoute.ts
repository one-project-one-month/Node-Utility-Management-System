import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
} from '../middlewares/validationMiddleware';
import {
  CreateContractTypeSchema,
  GetContractTypeParamSchema,
  UpdateContractTypeSchema,
} from '../validations/contractTypeSchema';
import {
  createContractTypeController,
  getAllContractTypeController,
  getByIdContractTypeController,
  updateContractTypeController,
} from '../controllers/contractTypeController';

const router = Router();

/**
 * @swagger
 * /api/v1/contract-types:
 *   post:
 *     tags: [Contract Types]
 *     summary: Create a new contract type (Admin & Staff only)
 *     description: Create a new contract type with name, duration, price, and facilities.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateContractTypeRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateContractTypeSuccess'
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
  validateRequestBody(CreateContractTypeSchema),
  createContractTypeController
);

/**
 * @swagger
 * /api/v1/contract-types:
 *   get:
 *     tags: [Contract Types]
 *     summary: Get all contract types (Admin & Staff only)
 *     description: Retrieves a list of all contract types.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetAllContractTypesSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/', hasRole(['Admin', 'Staff']), getAllContractTypeController);

/**
 * @swagger
 * /api/v1/contract-types/{contractTypeId}:
 *   get:
 *     tags: [Contract Types]
 *     summary: Get contract type by ID (Admin & Staff only)
 *     description: Retrieve a specific contract type by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ContractTypeIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetContractTypeSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:contractTypeId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetContractTypeParamSchema),
  getByIdContractTypeController
);

/**
 * @swagger
 * /api/v1/contract-types/{contractTypeId}:
 *   put:
 *     tags: [Contract Types]
 *     summary: Update contract type by ID (Admin & Staff only)
 *     description: Update contract type information. At least one field must be provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ContractTypeIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateContractTypeRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateContractTypeSuccess'
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
  '/:contractTypeId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetContractTypeParamSchema),
  validateRequestBody(UpdateContractTypeSchema),
  updateContractTypeController
);

export default router;
