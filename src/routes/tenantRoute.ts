import { Router } from 'express';
import {
  createTenantController,
  getActiveTenantCountController,
  getAllTenantController,
  getByIdTenantController,
  getTenantWithoutContractController,
  updateTenantController,
} from '../controllers/tenantController';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddleware';
import { PaginationQuerySchema } from '../validations/paginationSchema';
import {
  CreateTenantSchema,
  GetAllTenantQuerySchema,
  GetTenantParamSchema,
  UpdateTenantSchema,
} from '../validations/tenantSchema';

const router = Router();

/**
 * @swagger
 * /api/v1/tenants/no-contract:
 *   get:
 *     tags: [Tenants]
 *     summary: Get tenants without contract (Admin & Staff only)
 *     description: Retrieve a list of tenants without contracts. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetTenantWithoutContractSuccess'
 */
router.get(
  '/no-contract',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getTenantWithoutContractController
);

/**
 * @swagger
 * /api/v1/tenants/active-count:
 *   get:
 *     tags: [Tenants]
 *     summary: Get active tenant count (Admin & Staff only)
 *     description: Retrieve the count of active tenants. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetActiveTenantCountSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/active-count',
  hasRole(['Admin', 'Staff']),
  getActiveTenantCountController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}:
 *   get:
 *     tags: [Tenants]
 *     summary: Get tenant by ID (Admin, Staff & Tenant)
 *     description: Retrieve a specific tenant by their ID. Accessible to Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetTenantSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:tenantId',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetTenantParamSchema),
  getByIdTenantController
);

/**
 * @swagger
 * /api/v1/tenants:
 *   get:
 *     tags: [Tenants]
 *     summary: Get all tenants (Admin & Staff only)
 *     description: Retrieves a list of all tenants with pagination support. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedTenantsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllTenantQuerySchema),
  getAllTenantController
);

/**
 * @swagger
 * /api/v1/tenants:
 *   post:
 *     tags: [Tenants]
 *     summary: Create a new tenant (Admin & Staff only)
 *     description: Create a new tenant with name, email, NRC, etc. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateTenantRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateTenantSuccess'
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
  validateRequestBody(CreateTenantSchema),
  createTenantController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}:
 *   put:
 *     tags: [Tenants]
 *     summary: Update tenant by ID (Admin & Staff only)
 *     description: Update tenant information. At least one field must be provided. Accessible to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateTenantRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateTenantSuccess'
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
  '/:tenantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTenantParamSchema),
  validateRequestBody(UpdateTenantSchema),
  updateTenantController
);

export default router;
