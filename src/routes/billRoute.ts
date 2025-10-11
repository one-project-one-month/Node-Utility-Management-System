import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  CreateBillSchema,
  GetBillParamSchema,
  GetBillQuerySchema,
  GetTanentBillParamSchema,
  UpdateBillSchema,
} from './../validations/billSchema';
import {
  createBillController,
  getAllBillsController,
  getBillController,
  getTanentBillHistoryController,
  getTanentBillLatestController,
  updateBillController,
} from '../controllers/billController';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.get(
  '/bills',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetBillQuerySchema),
  getAllBillsController
);
router.get(
  '/bills/:bill_id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillParamSchema),
  getBillController
);
router.post(
  '/bills',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateBillSchema),

  createBillController
);
router.put(
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillParamSchema),
  validateRequestBody(UpdateBillSchema),
  updateBillController
);

//For tenant to view their bills

router.get(
  '/tenants/:tenantId/bills/latest',
  validateRequestParams(GetTanentBillParamSchema),
  getTanentBillLatestController
);

router.get(
  '/tenants/:tenantId/bills/history',
  validateRequestParams(GetTanentBillParamSchema),
  validateRequestQuery(GetBillQuerySchema),
  getTanentBillHistoryController
);

export default router;
