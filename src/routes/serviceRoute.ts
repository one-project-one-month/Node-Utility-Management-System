import { Router } from "express";
import { createService } from "../controllers/serviceController";
import { validateRequestBody, validateRequestParams } from "../middlewares/validationMiddlware";
import { idParamSchema, serviceSchema } from "../validations/serviceSchema";

const router = Router()

router.post("/:id/customer-services/create", validateRequestParams(idParamSchema), validateRequestBody(serviceSchema), createService)

export default router