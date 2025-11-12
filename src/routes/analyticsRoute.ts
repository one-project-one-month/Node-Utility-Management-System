import { Router } from 'express';
import { validateRequestQuery } from '../middlewares/validationMiddleware';
import { AnalyticsServiceQuerySchema } from '../validations/analyticsSchema';
import { getAnalyticServiceCountController } from '../controllers/analyticsController';
import {
  contractTypeAnalyticsController,
  roomAnalyticsController,
} from '../controllers/analyticsController';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/v1/analytics/contract-types/tenant-counts:
 *   get:
 *     tags: [Analytics]
 *     summary: Get contract type analytics (Admin & Staff only)
 *     description: Retrieves analytics for contract types based on tenant counts.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ContractTypeAnalyticsSuccess'
 */
router.get(
  '/analytics/contract-types/tenant-counts',
  hasRole(['Admin', 'Staff']),
  contractTypeAnalyticsController
);

/**
 * @swagger
 * /api/v1/analytics/rooms/status-counts:
 *   get:
 *     tags: [Analytics]
 *     summary: Get room analytics by status (Admin & Staff only)
 *     description: Retrieves analytics for rooms grouped by their status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/RoomAnalyticsSuccess'
 */
router.get(
  '/analytics/rooms/status-counts',
  hasRole(['Admin', 'Staff']),
  roomAnalyticsController
);

/**
 * @swagger
 * /api/v1/analytics/customer-services-counts:
 *   get:
 *     tags: [Analytics]
 *     summary: Get service analytics by status and priority (Admin & Staff only)
 *     description: Retrieves analytics for customer services grouped by their status and priority. (If status is not provided, it will default to "Pending".)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [priority, category, status]
 *           example: status
 *       - '$ref': '#/components/parameters/StatusQuery'
 *       - name: from
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: '2025-06-10'
 *       - name: to
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: '2025-12-18'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/CustomerServiceAnalyticsSuccess'
 */
router.get(
  '/analytics/customer-services-counts',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(AnalyticsServiceQuerySchema),
  getAnalyticServiceCountController
);

export default router;
