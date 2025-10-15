import { Router } from 'express';

import {
  validateRequestBody,
  validateRequestParams,
} from '../middlewares/validationMiddlware';

import { hasRole } from '../middlewares/authMiddleware';

import {
  createOccupantController,
  deleteOccupantController,
  updateOccupantController,
} from '../controllers/occupantController';
import {
  CreateOccupantSchema,
  DeleteOccupantSchema,
  GetOccupantParamSchema,
  UpdateOccupantSchema,
} from '../validations/occupantSchema';

const router = Router();

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
