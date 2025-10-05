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
import {
  CreateTenantSchema,
  GetTenantParamSchema,
  UpdateTenantSchema,
} from '../validations/tenantSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

router.get(
  '/:tenantId',
  hasRole(['Admin', 'Staff']),
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
  validateRequestBody(UpdateTenantSchema),
  updateTenantController
);

export default router;
