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
  UpdateBillSchema,
} from './../validations/billSchema';
import {
  createBillController,
  getAllBillsController,
  getBillController,
  updateBillController,
} from '../controllers/billController';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateBillSchema),
  createBillController
);
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetBillQuerySchema),
  getAllBillsController
);
router.put(
  '/:bill_id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillParamSchema),
  validateRequestBody(UpdateBillSchema),
  updateBillController
);

router.get(
  '/:bill_id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillParamSchema),
  getBillController
);

export default router;
