import { Router } from 'express';
import { contractTypeAnalyticsController } from '../controllers/analyticsController';

const router = Router();

// Contract type analytics
router.get(
  '/analytics/contract-types/tenantCounts',
  contractTypeAnalyticsController
);

export default router;
