import { Router } from 'express';
import {
  createReceiptController,
  getAllReceiptsController,
  getLatestReceiptByTenantIdController,
  getReceiptByIdController,
  getReceiptByInvoiceIdController,
  getReceiptHistoriesByTenantIdController,
  receiptMailSenderController,
  updateReceiptController,
} from '../controllers/receiptController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  CreateReceiptSchema,
  GetReceiptParamSchema,
  GetReceiptByInvoiceParamSchema,
  GetReceiptByTenantParamSchema,
  UpdateReceiptSchema,
  GetAllReceiptsQuerySchema,
  SendReceiptEmailSchema,
} from '../validations/receiptSchema';
import { hasRole } from '../middlewares/authMiddleware';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/receipts/latest:
 *   get:
 *     tags: [Receipts]
 *     summary: Get latest receipt by tenant ID
 *     description: Retrieve the most recent receipt for a specific tenant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetLatestReceiptSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/receipts/latest',
  validateRequestParams(GetReceiptByTenantParamSchema),
  getLatestReceiptByTenantIdController
);

/**
 * @swagger
 * /api/v1/tenants/{tenantId}/receipts/history:
 *   get:
 *     tags: [Receipts]
 *     summary: Get receipt history by tenant ID
 *     description: Retrieve all receipt history for a specific tenant with pagination.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ReceiptHistorySuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:tenantId/receipts/history',
  validateRequestParams(GetReceiptByTenantParamSchema),
  validateRequestQuery(PaginationQuerySchema),
  getReceiptHistoriesByTenantIdController
);

/**
 * @swagger
 * /api/v1/receipts:
 *   get:
 *     tags: [Receipts]
 *     summary: Get all receipts (Admin & Staff only)
 *     description: Retrieves a list of all receipts with pagination and filtering support. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/PaymentMethodFilterParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedReceiptsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/receipts',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllReceiptsQuerySchema),
  getAllReceiptsController
);

/**
 * @swagger
 * /api/v1/receipts/invoices/{invoiceId}:
 *   get:
 *     tags: [Receipts]
 *     summary: Get receipt by invoice ID (Admin & Staff only)
 *     description: Retrieve a receipt by its associated invoice ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/InvoiceIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetReceiptByInvoiceIdSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/receipts/invoices/:invoiceId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetReceiptByInvoiceParamSchema),
  getReceiptByInvoiceIdController
);

/**
 * @swagger
 * /api/v1/receipts/{id}:
 *   get:
 *     tags: [Receipts]
 *     summary: Get receipt by ID (Admin & Staff only)
 *     description: Retrieve a specific receipt by its ID. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ReceiptIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetReceiptSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/receipts/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetReceiptParamSchema),
  getReceiptByIdController
);

/**
 * @swagger
 * /api/v1/receipts:
 *   post:
 *     tags: [Receipts]
 *     summary: Create a new receipt (Admin & Staff only)
 *     description: Create a new receipt for an invoice. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateReceiptRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateReceiptSuccess'
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
  '/receipts',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateReceiptSchema),
  createReceiptController
);

/**
 * @swagger
 * /api/v1/receipts/{id}:
 *   put:
 *     tags: [Receipts]
 *     summary: Update receipt by ID (Admin & Staff only)
 *     description: Update receipt information. At least one field must be provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ReceiptIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateReceiptRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateReceiptSuccess'
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
  '/receipts/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetReceiptParamSchema),
  validateRequestBody(UpdateReceiptSchema),
  updateReceiptController
);

/**
 * @swagger
 * /api/v1/receipts/send-mail:
 *   post:
 *     tags: [Receipts]
 *     summary: Send receipt by email
 *     description: Send receipt by email to the tenant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/SendReceiptRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SendReceiptEmailSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
  '/receipts/send-mail',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(SendReceiptEmailSchema),
  receiptMailSenderController
);

export default router;
