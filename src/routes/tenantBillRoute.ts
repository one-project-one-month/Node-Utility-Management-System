import { Router } from 'express';
import {
  getTenantBillHistoryController,
  getTenantBillLatestController,
} from '../controllers/tenantBillController';
import { validateRequestParams } from '../middlewares/validationMiddlware';
import { GetTenantBillParamSchema } from '../validations/billSchema';

const router = Router();

router.get(
  '/:tenant_id/bills/latest',
  validateRequestParams(GetTenantBillParamSchema),
  getTenantBillLatestController
);

router.get(
  '/:tenant_id/bills/history',
  validateRequestParams(GetTenantBillParamSchema),
  getTenantBillHistoryController
);

export default router;
