import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
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

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateInvoiceSchema),
  createInvoiceController
);
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetInvoiceQuerySchema),
  getAllInvoicesController
);
router.put(
  '/:invoice_id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetInvoiceParamSchema),
  validateRequestBody(UpdateInvoiceSchema),
  updateInvoiceController
);

router.get(
  '/:invoice_id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetInvoiceParamSchema),
  getInvoiceController
);
router.get(
  '/:tenant_id/invoices/latest',
  validateRequestParams(GetTenantInvoiceParamSchema),
  getTenantInvoiceLatestController
);
router.get(
  '/:tenant_id/invoices/history',
  validateRequestParams(GetTenantInvoiceParamSchema),
  validateRequestQuery(GetInvoiceQuerySchema),
  getTenantInvoiceHistoryController
);

export default router;
