import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import { validateRequestQuery } from '../middlewares/validationMiddleware';
import {
  billsRevenueByMonthController,
  billStatusAnalyticsController,
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
export default router;
