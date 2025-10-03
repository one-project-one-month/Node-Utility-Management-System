import { Router } from 'express';

import {
  createTenantController,
  getAllTenantController,
  getByIdTenantController,
  updateTenantController,
} from '../controllers/tenantController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';

import {
  CreateTenantSchema,
  GetAllTenantsQuerySchema,
  GetTenantParamSchema,
  UpdateTenantSchema,
} from '../validations/tenantSchema';

const router = Router();

router.get(
  '/:tenantId',
  validateRequestParams(GetTenantParamSchema),
  getByIdTenantController
);

router.get(
  '/',
  validateRequestQuery(GetAllTenantsQuerySchema),
  getAllTenantController
);

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
