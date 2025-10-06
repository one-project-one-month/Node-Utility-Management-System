import { Router } from 'express';
import {
  createReceiptController,
  getAllReceiptsController,
  getLatestReceiptByTenantIdController,
  getReceiptByIdController,
  getReceiptByInvoiceIdController,
  getReceiptHistoriesByTenantIdController,
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
} from '../validations/receiptSchema';
import { hasRole } from '../middlewares/authMiddleware';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

// Get latest receipts by tenant id
router.get(
  '/tenants/:tenantId/receipts/latest',
  validateRequestParams(GetReceiptByTenantParamSchema),
  getLatestReceiptByTenantIdController
);

// Get receipts history by tenant id
router.get(
  '/tenants/:tenantId/receipts/history',
  validateRequestParams(GetReceiptByTenantParamSchema),
  validateRequestQuery(PaginationQuerySchema),
  getReceiptHistoriesByTenantIdController
);

// Dashboard
// Get all receipts
router.get(
  '/receipts',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllReceiptsQuerySchema),
  getAllReceiptsController
);

// Get receipt by invoice Id
router.get(
  '/receipts/invoice/:invoiceId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetReceiptByInvoiceParamSchema),
  getReceiptByInvoiceIdController
);

// Get receipt by receipt Id
router.get(
  '/receipts/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetReceiptParamSchema),
  getReceiptByIdController
);

router.post(
  '/receipts',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateReceiptSchema),
  createReceiptController
);

router.put(
  '/receipts/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetReceiptParamSchema),
  validateRequestBody(UpdateReceiptSchema),
  updateReceiptController
);

export default router;
