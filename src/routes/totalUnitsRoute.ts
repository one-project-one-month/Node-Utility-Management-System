import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  createTotalUnitsController,
  getAllTotalUnitsController,
  getTotalUnitsByBillIdController,
  getTotalUnitsByIdController,
  updateTotalUnitsController,
} from '../controllers/totalUnitsController';
import {
  CreateTotalUnitsSchema,
  GetTotalUnitsByBillParamSchema,
  GetTotalUnitsParamSchema,
  UpdateTotalUnitsSchema,
} from '../validations/totalUnitsSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

// Get all total-units
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllTotalUnitsController
);

// Get total-units by bill id
router.get(
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTotalUnitsByBillParamSchema),
  getTotalUnitsByBillIdController
);

// Get total-units by id
router.get(
  '/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTotalUnitsParamSchema),
  getTotalUnitsByIdController
);

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateTotalUnitsSchema),
  createTotalUnitsController
);

router.put(
  '/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTotalUnitsParamSchema),
  validateRequestBody(UpdateTotalUnitsSchema),
  updateTotalUnitsController
);

export default router;
