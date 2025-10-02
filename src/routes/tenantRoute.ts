import { Router } from 'express';

import {
  createTenantController,
  updateTenantController,
} from '../controllers/tenantController';
import {
  validateRequestBody,
  validateRequestParams,
} from '../middlewares/validationMiddlware';
import {
  CreateTenantSchema,
  GetTenantParamSchema,
  UpdateTenantSchema,
} from '../validations/tenantSchema';

const router = Router();

router.post(
  '/',
  validateRequestBody(CreateTenantSchema),
  createTenantController
);

router.put(
  '/:tenantId',
  validateRequestParams(GetTenantParamSchema),
  validateRequestBody(UpdateTenantSchema),
  updateTenantController
);

export default router;
