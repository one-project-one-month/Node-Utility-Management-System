import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  createCustomerServiceSchema,
  idSchema,
  paginationQuerySchema,
  tenantIdAndStatusSchema,
  updateCustomerServiceSchema,
} from '../validations/serviceSchema';
import {
  createServiceController,
  getAllServiceController,
  getServiceById,
  serviceHistoryController,
  updateServiceController,
} from '../controllers/serviceController';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

// create customer service from client
router.post(
  '/tenants/:id/customer-services/create',
  validateRequestParams(idSchema),
  validateRequestBody(createCustomerServiceSchema),
  createServiceController
);

//get tenant's customer service history
router.get(
  '/tenants/:id/customer-services/history/:status',
  validateRequestParams(tenantIdAndStatusSchema),
  validateRequestQuery(paginationQuerySchema),
  serviceHistoryController
);

// Dashboard
router.get(
  '/customer-services/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(paginationQuerySchema),
  getAllServiceController
);
router.get(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(idSchema),
  getServiceById
);
router.put(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(idSchema),
  validateRequestBody(updateCustomerServiceSchema),
  updateServiceController
); // update customer service from dashboard

export default router;
