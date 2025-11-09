import { Router } from "express";
import { validateRequestQuery } from "../middlewares/validationMiddleware";
import { AnalyticsServiceQuerySchema } from "../validations/analyticsSchema";
import { getAnalyticServiceCountController } from "../controllers/analyticsController";
import { hasRole } from "../middlewares/authMiddleware";

const router = Router()

router.get('/analytics/customer-services-counts',
    hasRole(['Admin', 'Staff']),
    validateRequestQuery(AnalyticsServiceQuerySchema), getAnalyticServiceCountController)

export default router;