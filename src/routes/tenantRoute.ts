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

import { hasRole } from '../middlewares/authMiddleware';
import { validateUpdateTenantBody } from '../middlewares/validateUpdateTenantBody';
import {
  CreateTenantSchema,
  GetTenantParamSchema,
} from '../validations/tenantSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

router.get(
  '/:tenantId',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetTenantParamSchema),
  getByIdTenantController
);

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllTenantController
);

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateTenantSchema),
  createTenantController
);

router.put(
  '/:tenantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTenantParamSchema),
  validateUpdateTenantBody,
  updateTenantController
);

export default router;
