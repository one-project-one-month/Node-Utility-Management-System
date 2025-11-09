import { Router } from "express";
import { validateRequestQuery } from "../middlewares/validationMiddleware";
import { AnalyticsServiceQuerySchema } from "../validations/analyticsSchema";
import { getAnalyticServiceCount } from "../services/analyticsServices";
import { getAnalyticServiceCountController } from "../controllers/analyticsController";

const router = Router()

router.get('/customer-service-count', validateRequestQuery(AnalyticsServiceQuerySchema), getAnalyticServiceCountController)

export default router;