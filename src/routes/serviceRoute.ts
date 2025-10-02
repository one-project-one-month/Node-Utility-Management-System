import { Router } from "express";
import { validateRequestBody } from "../middlewares/validationMiddlware";
import { serviceController } from "../controllers/serviceController";
import { customerServiceSchema } from "../validations/serviceSchema";

const router = Router()

router.post("/:id/customer-services/create", validateRequestBody(customerServiceSchema), serviceController)

export default router