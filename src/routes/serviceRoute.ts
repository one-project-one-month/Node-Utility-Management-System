import { Router } from "express";
import { createService } from "../controllers/serviceController";
import { validateRequestBody } from "../middlewares/validationMiddlware";
import { serviceSchema } from "../validations/serviceSchema";

const router = Router()

router.post("/:id/customer-services/create", validateRequestBody(serviceSchema), createService)

export default router