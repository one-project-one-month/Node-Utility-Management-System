import { Router } from "express";
import { validateRequestBody, validateRequestParams, validateRequestQuery } from "../middlewares/validationMiddlware";
import { createCustomerServiceSchema, idSchema, paginationQuerySchema, updateCustomerServiceSchema } from "../validations/serviceSchema";
import { createServiceController, getAllServiceController, getServiceById, updateServiceController } from "../controllers/serviceController";


const router = Router()

router.post("/tenants/:id/customer-services/create", validateRequestParams(idSchema), validateRequestBody(createCustomerServiceSchema), createServiceController) // create customer service from client

// Dashboard
router.get("/customer-services/", validateRequestQuery(paginationQuerySchema), getAllServiceController)
router.get("/customer-services/:id", validateRequestParams(idSchema), getServiceById)
router.put("/customer-services/:id", validateRequestParams(idSchema), validateRequestBody(updateCustomerServiceSchema), updateServiceController) // update customer service from dashboard

export default router