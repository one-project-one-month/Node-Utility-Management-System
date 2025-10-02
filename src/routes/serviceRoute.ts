import { Router } from "express";
import { validateRequestBody, validateRequestParams } from "../middlewares/validationMiddlware";
import { createCustomerServiceSchema, idSchema, updateCustomerServiceSchema } from "../validations/serviceSchema";
import { createServiceController, getAllServiceController, updateServiceController } from "../controllers/serviceController";


const router = Router()

router.post("/tenants/:id/customer-services/create", validateRequestParams(idSchema), validateRequestBody(createCustomerServiceSchema), createServiceController) // create customer service from client
router.put("/customer-services/:id", validateRequestParams(idSchema), validateRequestBody(updateCustomerServiceSchema), updateServiceController) // update customer service from dashboard
router.get("/customer-services/", getAllServiceController)
// router.get("/customer-services/:id", validateRequestParams(idSchema))


// router.post("/tenants/:id/customer-services/create", validateRequestBody(createCustomerServiceSchema), createServiceController)
// router.post("/tenants/:id/customer-services/create", validateRequestBody(createCustomerServiceSchema), createServiceController)

export default router