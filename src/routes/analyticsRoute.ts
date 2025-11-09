import { Router } from 'express';
import { contractTypeAnalyticsController } from '../controllers/analyticsController';
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

export default router;
