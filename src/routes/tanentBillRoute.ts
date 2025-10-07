import { Router } from 'express';
import {
  getTanentBillHistoryController,
  getTanentBillLatestController,
} from '../controllers/tanentBillController';
import { validateRequestParams } from '../middlewares/validationMiddlware';
import { GetTanentBillParamSchema } from '../validations/billSchema';

const router = Router();

router.get(
  '/:tenant_id/bills/latest',
  validateRequestParams(GetTanentBillParamSchema),
  getTanentBillLatestController
);

router.get(
  '/:tenant_id/bills/history',
  validateRequestParams(GetTanentBillParamSchema),
  getTanentBillHistoryController
);

export default router;
