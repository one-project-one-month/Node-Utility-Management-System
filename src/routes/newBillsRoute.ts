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
  GetBillByTenantIdSchema,
  UpdateBillSchema,
} from '../validations/newBillsSchema';
import {
  billAutoGenerateController,
  createBillController,
  getAllBillsController,
  getBillByIdController,
  getBillHistoryByTenantIdController,
  getLatestBillByTenantIdController,
  updateBillController,
} from '../controllers/newBillsController';
import { PaginationQuerySchema } from '../validations/paginationSchema';

const router = Router();

router.get(
  '/bills/auto-generate',
  hasRole(['Admin', 'Staff']),
  billAutoGenerateController
);

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

router.get(
  '/tenants/:tenantId/bills/latest',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetBillByTenantIdSchema),
  getLatestBillByTenantIdController
);

router.get(
  '/tenants/:tenantId/bills/history',
  hasRole(['Admin', 'Staff', 'Tenant']),
  validateRequestParams(GetBillByTenantIdSchema),
  validateRequestQuery(PaginationQuerySchema),
  getBillHistoryByTenantIdController
);

export default router;
