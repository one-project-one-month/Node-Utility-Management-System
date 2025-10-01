import { Router } from 'express';

import { createTenantController } from '../controllers/tenantController';
import { validateRequestBody } from '../middlewares/validationMiddlware';
import { CreateTenantSchema } from '../validations/tenantSchema';

const router = Router();

router.post(
  '/',
  validateRequestBody(CreateTenantSchema),
  createTenantController
);

export default router;
