import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  CreateBillSchema,
  GetBillByIdSchema,
  UpdateBillSchema,
} from '../validations/newBillsSchema';
import {
  createBillController,
  getAllBillsController,
  getBillByIdController,
  updateBillController,
} from '../controllers/newBillsController';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

router.post(
  '/bills',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateBillSchema),
  createBillController
);

router.put(
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillByIdSchema),
  validateRequestBody(UpdateBillSchema),
  updateBillController
);

router.get(
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetBillByIdSchema),
  getBillByIdController
);

router.get(
  '/bills',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllBillsController
);

export default router;
