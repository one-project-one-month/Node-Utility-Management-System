import { Router } from 'express';
import {
  createReceiptController,
  getAllReceiptsController,
  getLatestReceiptsByTenantIdController,
  getReceiptByIdController,
  getReceiptByInvoiceIdController,
  getReceiptHistoriesByTenantIdController,
  updateReceiptController,
} from '../controllers/receiptController';
import {
  validateRequestBody,
  validateRequestParams,
} from '../middlewares/validationMiddlware';
import {
  CreateReceiptSchema,
  GetReceiptParamSchema,
  GetReceiptByInvoiceParamSchema,
  GetReceiptByTenantParamSchema,
  UpdateReceiptSchema,
} from '../validations/receiptSchema';

const router = Router();

router.get('/receipts', getAllReceiptsController);

// Get latest receipts by tenant id
router.get(
  '/tenants/:tenantId/receipts/latest',
  validateRequestParams(GetReceiptByTenantParamSchema),
  getLatestReceiptsByTenantIdController
);

// Get receipts history by tenant id
router.get(
  '/tenants/:tenantId/receipts/history',
  validateRequestParams(GetReceiptByTenantParamSchema),
  getReceiptHistoriesByTenantIdController
);

// Get receipt by invoice Id
router.get(
  '/receipts/invoice/:invoiceId',
  validateRequestParams(GetReceiptByInvoiceParamSchema),
  getReceiptByInvoiceIdController
);

// Get receipt by receipt Id
router.get(
  '/receipts/:id',
  validateRequestParams(GetReceiptParamSchema),
  getReceiptByIdController
);

router.post(
  '/receipts',
  validateRequestBody(CreateReceiptSchema),
  createReceiptController
);

router.put(
  '/receipts/:id',
  validateRequestParams(GetReceiptParamSchema),
  validateRequestBody(UpdateReceiptSchema),
  updateReceiptController
);

export default router;
