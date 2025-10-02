import { Router } from "express";
import { validateRequestBody, validateRequestParams } from "../middlewares/validationMiddlware";
import { createCustomerServiceSchema, customerServiceID, updateCustomerServiceSchema } from "../validations/serviceSchema";
import { createServiceController, updateServiceController } from "../controllers/serviceController";


const router = Router()

router.post("/tenants/:id/customer-services/create", validateRequestBody(createCustomerServiceSchema), createServiceController) // create customer service from client
router.put("/customer-services/:id", validateRequestParams(customerServiceID), validateRequestBody(updateCustomerServiceSchema), updateServiceController) // update customer service from dashboard
// router.post("/tenants/:id/customer-services/create", validateRequestBody(createCustomerServiceSchema), createServiceController)
// router.post("/tenants/:id/customer-services/create", validateRequestBody(createCustomerServiceSchema), createServiceController)

export default router