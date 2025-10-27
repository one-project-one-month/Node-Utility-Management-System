import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  ContractIdSchema,
  CreateContractSchema,
  GetContractByTenantSchema,
  UpdateContractSchema,
} from '../validations/contractSchema';
import {
  createContractController,
  getContractByTenantIdController,
  getAllContractController,
  getContractByIdController,
  updateContractController,
} from '../controllers/contractController';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

/**
 * @swagger
 * /api/v1/contracts:
 *   post:
 *     tags: [Contracts]
 *     summary: Create a new contract (Admin & Staff only)
 *     description: Create a new contract between tenant and room with contract type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateContractRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateContractSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
  '/contracts',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateContractSchema),
  createContractController
);

/**
 * @swagger
 * /api/v1/contracts/{contractId}:
 *   put:
 *     tags: [Contracts]
 *     summary: Update contract by ID (Admin & Staff only)
 *     description: Update contract information. At least one field must be provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ContractIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateContractRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateContractSuccess'
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
  '/contracts/:contractId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(ContractIdSchema),
  validateRequestBody(UpdateContractSchema),
  updateContractController
);

/**
 * @swagger
 * /api/v1/contracts/show/{contractId}:
 *   get:
 *     tags: [Contracts]
 *     summary: Get contract by ID (Admin & Staff only)
 *     description: Retrieve a specific contract by its ID with tenant, room, and contract type details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ContractIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetContractSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/contracts/show/:contractId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(ContractIdSchema),
  getContractByIdController
);

/**
 * @swagger
 * /api/v1/contracts:
 *   get:
 *     tags: [Contracts]
 *     summary: Get all contracts (Admin & Staff only)
 *     description: Retrieves a list of all contracts with pagination support.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedContractsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/contracts',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllContractController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/contracts:
 *   get:
 *     tags: [Contracts]
 *     summary: Get contract by tenant ID
 *     description: Retrieve all contracts for a specific tenant. Accessible by Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetContractByTenantSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/contracts',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetContractByTenantSchema),
  getContractByTenantIdController
);

export default router;
