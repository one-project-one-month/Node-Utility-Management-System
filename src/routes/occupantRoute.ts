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
} from '../controllers/occupantController';
import {
  CreateOccupantSchema,
  DeleteOccupantSchema,
  GetOccupantParamSchema,
  UpdateOccupantSchema,
} from '../validations/occupantSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

router.get(
  '/:occupantId',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetOccupantParamSchema),
  getByIdOccupantController
);

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllOccupantController
);

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateOccupantSchema),
  createOccupantController
);

router.put(
  '/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  validateRequestBody(UpdateOccupantSchema),
  updateOccupantController
);

router.delete(
  '/:occupantId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetOccupantParamSchema),
  validateRequestBody(DeleteOccupantSchema),
  deleteOccupantController
);

export default router;
