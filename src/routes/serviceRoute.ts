import { Router } from 'express';
import {
  createServiceController,
  deleteServiceController,
  getAllServiceController,
  getServiceById,
  serviceHistoryController,
  updateServiceController,
} from '../controllers/serviceController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  CreateCustomerServiceSchema,
  GetAllServiceQuerySchema,
  IdSchema,
  TenantIdAndStatusSchema,
  UpdateCustomerServiceSchema,
} from '../validations/serviceSchema';
import { PaginationQuerySchema } from '../validations/paginationSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/tenants/:id/customer-services/create',
  validateRequestParams(IdSchema),
  validateRequestBody(CreateCustomerServiceSchema),
  createServiceController
); // create customer service from client

router.get(
  '/tenants/:id/customer-services/history/:status',
  validateRequestParams(TenantIdAndStatusSchema),
  validateRequestQuery(PaginationQuerySchema),
  serviceHistoryController
); // get customer service history from client

// Dashboard
router.get(
  '/customer-services/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllServiceQuerySchema),
  getAllServiceController
);
router.get(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(IdSchema),
  getServiceById
);
router.put(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(IdSchema),
  validateRequestBody(UpdateCustomerServiceSchema),
  updateServiceController
); // update customer service from dashboard
router.delete(
  '/customer-services/:id',
  validateRequestParams(IdSchema),
  deleteServiceController
);
export default router;
