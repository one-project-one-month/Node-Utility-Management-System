import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddleware';
import {
  CreateBillSchema,
  GetAllBillQuerySchema,
  GetBillByIdSchema,
  GetBillByTenantIdSchema,
  UpdateBillSchema,
} from '../validations/newBillsSchema';
import {
  billAutoGenerateController,
  createBillController,
  getAllBillsController,
  getBillByIdController,
  getBillHistoryByTenantIdController,
  getBillsofLastFourMonthController,
  getLatestBillByTenantIdController,
  updateBillController,
} from '../controllers/newBillsController';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

/**
 * @swagger
 * /api/v1/bills/auto-generate:
 *   get:
 *     tags: [Bills]
 *     summary: Auto-generate bills for all rented rooms (Admin & Staff only)
 *     description: Automatically generates bills for all rooms with status 'Rented' and sends email notifications to tenants.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AutoGenerateBillsSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/bills/auto-generate',
  hasRole(['Admin', 'Staff']),
  billAutoGenerateController
);

/**
 * @swagger
 * /api/v1/bills:
 *   post:
 *     tags: [Bills]
 *     summary: Create a new bill (Admin & Staff only)
 *     description: Create a new bill for a specific room. If fees are not provided, they will be auto-generated.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateBillRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateBillSuccess'
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
  '/bills',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateBillSchema),
  createBillController
);

/**
 * @swagger
 * /api/v1/bills/{billId}:
 *   put:
 *     tags: [Bills]
 *     summary: Update bill by ID (Admin & Staff only)
 *     description: Update bill information. At least one field must be provided. Total units are automatically recalculated.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BillIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateBillRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateBillSuccess'
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
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillByIdSchema),
  validateRequestBody(UpdateBillSchema),
  updateBillController
);

/**
 * @swagger
 * /api/v1/bills/{billId}:
 *   get:
 *     tags: [Bills]
 *     summary: Get bill by ID (Admin & Staff only)
 *     description: Retrieve a specific bill by its ID with full details including room, contract, total units, and invoice.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BillIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetBillSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillByIdSchema),
  getBillByIdController
);

/**
 * @swagger
 * /api/v1/bills:
 *   get:
 *     tags: [Bills]
 *     summary: Get all bills (Admin & Staff only)
 *     description: Retrieves a list of all bills with pagination support.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedBillsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/bills',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllBillQuerySchema),
  getAllBillsController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/bills/latest:
 *   get:
 *     tags: [Bills]
 *     summary: Get latest bill by tenant ID (Admin, Staff & Tenant)
 *     description: Retrieve the most recent bill for a specific tenant. Accessible by Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BillTenantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetLatestBillSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/bills/latest',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetBillByTenantIdSchema),
  getLatestBillByTenantIdController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/bills/history:
 *   get:
 *     tags: [Bills]
 *     summary: Get bill history by tenant ID (Admin, Staff & Tenant)
 *     description: Retrieve all bill history for a specific tenant with pagination. Accessible by Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BillTenantIdParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedBillHistoryResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/bills/history',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetBillByTenantIdSchema),
  validateRequestQuery(PaginationQuerySchema),
  getBillHistoryByTenantIdController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/bills/lastFourMonths:
 *   get:
 *     tags: [Bills]
 *     summary: Get total units consumption for last four months by tenant
 *     description: Retrieve aggregated total units (electricity + water) consumption for the last four months for a specific tenant. Accessible by Admin, Staff, and the tenant themselves.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BillTenantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetFourMonthsBillSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/bills/lastFourMonths',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetBillByTenantIdSchema),
  getBillsofLastFourMonthController
);

export default router;
