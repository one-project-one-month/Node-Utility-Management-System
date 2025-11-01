import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddleware';
import { hasRole } from '../middlewares/authMiddleware';
import {
  createOccupantController,
  deleteOccupantController,
  getAllOccupantController,
  getByIdOccupantController,
  updateOccupantController,
  getByTenantIdOccupantController,
} from '../controllers/occupantController';
import {
  CreateOccupantSchema,
  DeleteOccupantSchema,
  GetOccupantParamSchema,
  UpdateOccupantSchema,
  GetOccupantByTenantParamSchema,
} from '../validations/occupantSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

/**
 * @swagger
 * /api/v1/occupants/{occupantId}:
 *   get:
 *     tags: [Occupants]
 *     summary: Get occupant by ID (Admin, Staff & Tenant only)
 *     description: Retrieve a specific occupant by their ID. Accessible to Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/OccupantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetOccupantSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/occupants/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  getByIdOccupantController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/occupants:
 *   get:
 *     tags: [Occupants]
 *     summary: Get occupants by tenant ID
 *     description: Retrieve all occupants for a specific tenant. Accessible by Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/GetOccupantByTenantParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/OccupantsByTenantResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/occupants',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetOccupantByTenantParamSchema),
  getByTenantIdOccupantController
);

/**
 * @swagger
 * /api/v1/occupants:
 *   get:
 *     tags: [Occupants]
 *     summary: Get all occupants (Admin & Staff only)
 *     description: Retrieves a list of all occupants with pagination support. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedOccupantsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/occupants',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllOccupantController
);

/**
 * @swagger
 * /api/v1/occupants:
 *   post:
 *     tags: [Occupants]
 *     summary: Create new occupants (Admin & Staff only)
 *     description: Create one or more occupants for a tenant. All occupants must belong to the same tenant.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateOccupantRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateOccupantSuccess'
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
  '/occupants',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateOccupantSchema),
  createOccupantController
);

/**
 * @swagger
 * /api/v1/occupants/{occupantId}:
 *   put:
 *     tags: [Occupants]
 *     summary: Update occupant by ID (Admin & Staff only)
 *     description: Update occupant information. At least one field must be provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/OccupantIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateOccupantRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateOccupantSuccess'
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
  '/occupants/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  validateRequestBody(UpdateOccupantSchema),
  updateOccupantController
);

/**
 * @swagger
 * /api/v1/occupants/{occupantId}:
 *   delete:
 *     tags: [Occupants]
 *     summary: Delete occupant by ID (Admin & Staff only)
 *     description: Delete an occupant. Requires tenantId in request body for verification.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/OccupantIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/DeleteOccupantRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteOccupantSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/occupants/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  validateRequestBody(DeleteOccupantSchema),
  deleteOccupantController
);

export default router;
