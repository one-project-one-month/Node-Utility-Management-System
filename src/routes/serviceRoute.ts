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
} from '../middlewares/validationMiddleware';
import {
  CreateCustomerServiceSchema,
  GetAllServiceQuerySchema,
  IdSchema,
  TenantIdSchema,
  TenantServiceHistorySchema,
  UpdateCustomerServiceSchema,
} from '../validations/serviceSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/v1/tenants/{id}/customer-services/create:
 *   post:
 *     tags: [Customer Services]
 *     summary: Create a new customer service request
 *     description: Allows a tenant to create a new customer service request.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateCustomerServiceRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateServiceSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
  '/tenants/:id/customer-services/create',
  validateRequestParams(TenantIdSchema),
  validateRequestBody(CreateCustomerServiceSchema),
  createServiceController
);

/**
 * @swagger
 * /api/v1/tenants/{id}/customer-services/history/{status}:
 *   get:
 *     tags: [Customer Services]
 *     summary: Get customer service history by status
 *     description: Retrieves all customer service records for a tenant filtered by status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TenantIdParam'
 *       - $ref: '#/components/parameters/StatusParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ServiceHistorySuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/tenants/:id/customer-services/history',
  validateRequestParams(TenantIdSchema),
  validateRequestQuery(TenantServiceHistorySchema),
  serviceHistoryController
);

/**
 * @swagger
 * /api/v1/customer-services:
 *   get:
 *     tags: [Customer Services]
 *     summary: Get all customer services (Admin & Staff only)
 *     description: Retrieves all customer service records with pagination. Accessible to Admin and Staff users only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/CategoryParam'
 *       - $ref: '#/components/parameters/StatusQuery'
 *       - $ref: '#/components/parameters/PriorityLevelParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedCustomerServicesResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/customer-services/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllServiceQuerySchema),
  getAllServiceController
);

/**
 * @swagger
 * /api/v1/customer-services/{id}:
 *   get:
 *     tags: [Customer Services]
 *     summary: Get customer service by ID (Admin & Staff only)
 *     description: Retrieves a single customer service record by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CustomerServiceIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetServiceSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(IdSchema),
  getServiceById
);

/**
 * @swagger
 * /api/v1/customer-services/{id}:
 *   put:
 *     tags: [Customer Services]
 *     summary: Update a customer service (Admin & Staff only)
 *     description: Update the status or priority level of an existing customer service record.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CustomerServiceIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateCustomerServiceRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateServiceSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(IdSchema),
  validateRequestBody(UpdateCustomerServiceSchema),
  updateServiceController
);

/**
 * @swagger
 * /api/v1/customer-services/{id}:
 *   delete:
 *     tags: [Customer Services]
 *     summary: Delete customer service by ID (Admin & Staff only)
 *     description: Delete a customer service record.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CustomerServiceIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteServiceSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/customer-services/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(IdSchema),
  deleteServiceController
);

export default router;
