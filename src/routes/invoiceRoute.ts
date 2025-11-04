import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddleware';
import {
  CreateInvoiceSchema,
  GetInvoiceParamSchema,
  GetInvoiceQuerySchema,
  GetTenantInvoiceParamSchema,
  UpdateInvoiceSchema,
} from './../validations/invoiceSchema';
import {
  createInvoiceController,
  getAllInvoicesController,
  getInvoiceController,
  getTenantInvoiceHistoryController,
  getTenantInvoiceLatestController,
  updateInvoiceController,
} from './../controllers/invoiceController';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/v1/invoices:
 *   post:
 *     tags: [Invoices]
 *     summary: Create a new invoice (Admin & Staff only)
 *     description: Create a new invoice for a bill.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateInvoiceRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateInvoiceSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/invoices',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateInvoiceSchema),
  createInvoiceController
);

/**
 * @swagger
 * /api/v1/invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: Get all invoices (Admin & Staff only)
 *     description: Retrieves a list of all invoices with pagination support.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/InvoiceStatusParam'
 *       - $ref: '#/components/parameters/MonthParam'
 *       - $ref: '#/components/parameters/YearParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedInvoicesResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/invoices',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetInvoiceQuerySchema),
  getAllInvoicesController
);

/**
 * @swagger
 * /api/v1/invoices/{invoiceId}:
 *   put:
 *     tags: [Invoices]
 *     summary: Update invoice by ID (Admin & Staff only)
 *     description: Update invoice information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/InvoiceIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateInvoiceRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateInvoiceSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/invoices/:invoiceId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetInvoiceParamSchema),
  validateRequestBody(UpdateInvoiceSchema),
  updateInvoiceController
);

/**
 * @swagger
 * /api/v1/invoices/{invoiceId}:
 *   get:
 *     tags: [Invoices]
 *     summary: Get invoice by ID (Admin & Staff only)
 *     description: Retrieve a specific invoice by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/InvoiceIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetInvoiceSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/invoices/:invoiceId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetInvoiceParamSchema),
  getInvoiceController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/invoices/latest:
 *   get:
 *     tags: [Invoices]
 *     summary: Get latest invoice by tenant ID
 *     description: Retrieve the most recent invoice for a specific tenant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetLatestInvoiceSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/invoices/latest',
  validateRequestParams(GetTenantInvoiceParamSchema),
  getTenantInvoiceLatestController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/invoices/history:
 *   get:
 *     tags: [Invoices]
 *     summary: Get invoice history by tenant ID
 *     description: Retrieve all invoice history for a specific tenant with pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/InvoiceStatusParam'
 *       - $ref: '#/components/parameters/MonthParam'
 *       - $ref: '#/components/parameters/YearParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/InvoiceHistorySuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/invoices/history',
  validateRequestParams(GetTenantInvoiceParamSchema),
  validateRequestQuery(GetInvoiceQuerySchema),
  getTenantInvoiceHistoryController
);

export default router;
