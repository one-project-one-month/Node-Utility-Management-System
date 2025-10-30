import { Router } from 'express';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddleware';
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

/**
 * @swagger
 * /api/v1/total-units:
 *   get:
 *     tags: [Total Units]
 *     summary: Get all total units (Admin & Staff only)
 *     description: Retrieves a list of all total units with pagination support.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedTotalUnitsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(PaginationQuerySchema),
  getAllTotalUnitsController
);

/**
 * @swagger
 * /api/v1/total-units/bills/{billId}:
 *   get:
 *     tags: [Total Units]
 *     summary: Get total units by bill ID (Admin & Staff only)
 *     description: Retrieve total units record associated with a specific bill.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BillIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetTotalUnitsByBillSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/bills/:billId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTotalUnitsByBillParamSchema),
  getTotalUnitsByBillIdController
);

/**
 * @swagger
 * /api/v1/total-units/{id}:
 *   get:
 *     tags: [Total Units]
 *     summary: Get total units by ID (Admin & Staff only)
 *     description: Retrieve specific total units record by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TotalUnitsIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetTotalUnitsSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTotalUnitsParamSchema),
  getTotalUnitsByIdController
);

/**
 * @swagger
 * /api/v1/total-units:
 *   post:
 *     tags: [Total Units]
 *     summary: Create new total units (Admin & Staff only)
 *     description: Create new total units record for a bill.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateTotalUnitsRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateTotalUnitsSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateTotalUnitsSchema),
  createTotalUnitsController
);

/**
 * @swagger
 * /api/v1/total-units/{id}:
 *   put:
 *     tags: [Total Units]
 *     summary: Update total units by ID (Admin & Staff only)
 *     description: Update total units information. At least one field must be provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TotalUnitsIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateTotalUnitsRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateTotalUnitsSuccess'
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
  '/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetTotalUnitsParamSchema),
  validateRequestBody(UpdateTotalUnitsSchema),
  updateTotalUnitsController
);

export default router;
