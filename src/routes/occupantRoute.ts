import { Router } from 'express';

import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';

import { hasRole } from '../middlewares/authMiddleware';

import {
  createOccupantController,
  deleteOccupantController,
  getAllOccupantController,
  getByIdOccupantController,
  updateOccupantController,
  getByTenantIdOccupantController,
} from '../controllers/occupantController';
import {
  CreateOccupantSchema,
  DeleteOccupantSchema,
  GetOccupantParamSchema,
  UpdateOccupantSchema,
  GetOccupantByTenantParamSchema,
} from '../validations/occupantSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

router.get(
  '/occupants/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  getByIdOccupantController
);

router.get(
  '/tenants/:tenantId/occupants',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetOccupantByTenantParamSchema),
  getByTenantIdOccupantController
);

router.get(
  '/occupants',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllOccupantController
);

router.post(
  '/occupants',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateOccupantSchema),
  createOccupantController
);

router.put(
  '/occupants/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  validateRequestBody(UpdateOccupantSchema),
  updateOccupantController
);

router.delete(
  '/occupants/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  validateRequestBody(DeleteOccupantSchema),
  deleteOccupantController
);

export default router;
