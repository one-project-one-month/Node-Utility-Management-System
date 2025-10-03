import { Router } from 'express';
import {
  createReceiptController,
  getAllReceiptsController,
  getReceiptByIdController,
  getReceiptByInvoiceIdController,
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
  UpdateReceiptSchema,
} from '../validations/receiptSchema';

const router = Router();

router.get('/', getAllReceiptsController);

// Get receipt by invoice ID
router.get(
  '/invoice/:invoiceId',
  validateRequestParams(GetReceiptByInvoiceParamSchema),
  getReceiptByInvoiceIdController
);

// Get receipt by receipt ID
router.get(
  '/:id',
  validateRequestParams(GetReceiptParamSchema),
  getReceiptByIdController
);

router.post(
  '/',
  validateRequestBody(CreateReceiptSchema),
  createReceiptController
);

router.put(
  '/:id',
  validateRequestParams(GetReceiptParamSchema),
  validateRequestBody(UpdateReceiptSchema),
  updateReceiptController
);

export default router;
