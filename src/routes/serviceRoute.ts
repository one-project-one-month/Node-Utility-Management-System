import { Router } from 'express';
import {
  createServiceController,
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
  createCustomerServiceSchema,
  idSchema,
  paginationQuerySchema,
  tenantIdAndStatusSchema,
  updateCustomerServiceSchema,
} from '../validations/serviceSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/tenants/:id/customer-services/create',
  validateRequestParams(idSchema),
  validateRequestBody(createCustomerServiceSchema),
  createServiceController
); // create customer service from client

router.get(
  '/tenants/:id/customer-services/history/:status',
  validateRequestParams(tenantIdAndStatusSchema),
  validateRequestQuery(paginationQuerySchema),
  serviceHistoryController
); // get customer service history from client

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
