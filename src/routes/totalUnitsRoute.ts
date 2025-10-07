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

const router = Router();

// Get all total-units
router.get('/', validateRequestQuery(PaginationQuerySchema) ,getAllTotalUnitsController);

// Get total-units by bill id
router.get(
  '/bills/:billId',
  validateRequestParams(GetTotalUnitsByBillParamSchema),
  getTotalUnitsByBillIdController
);

// Get total-units by id
router.get(
  '/:id',
  validateRequestParams(GetTotalUnitsParamSchema),
  getTotalUnitsByIdController
);

router.post(
  '/',
  validateRequestBody(CreateTotalUnitsSchema),
  createTotalUnitsController
);

router.put(
  '/:id',
  validateRequestParams(GetTotalUnitsParamSchema),
  validateRequestBody(UpdateTotalUnitsSchema),
  updateTotalUnitsController
);

export default router;
