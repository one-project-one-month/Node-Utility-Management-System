import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import { validateRequestQuery } from '../middlewares/validationMiddleware';
import {
  billsRevenueByMonthController,
  billStatusAnalyticsController,
  contractTypeAnalyticsController,
  roomAnalyticsController,
} from '../controllers/analyticsController';
import { GetTotalRevenueByMonthSchema } from '../validations/newBillsSchema';

const router = Router();

router.get(
  '/analytics/bills/amount-by-status',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetTotalRevenueByMonthSchema),
  billStatusAnalyticsController
);

router.get(
  '/analytics/bills/revenue-by-month',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetTotalRevenueByMonthSchema),
  billsRevenueByMonthController
);

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

export default router;
