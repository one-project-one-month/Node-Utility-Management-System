import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  ContractIdSchema,
  CreateContractSchema,
  GetAllContractSchema,
  GetContractByTenantSchema,
  UpdateContractSchema,
} from '../validations/contractSchema';
import {
  createContractController,
  getAllContractByTenantIdController,
  getAllContractController,
  getContractByIdController,
  updateContractController,
} from '../controllers/contractController';

const router = Router();

router.post(
  '/contracts',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateContractSchema),
  createContractController
);

router.put(
  '/contracts/:contractId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(ContractIdSchema),
  validateRequestBody(UpdateContractSchema),
  updateContractController
);

router.get(
  '/contracts/show/:contractId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(ContractIdSchema),
  getContractByIdController
);

router.get(
  '/contracts',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllContractSchema),
  getAllContractController
);

// Get all contracts by tenant
router.get(
  '/tenants/:tenantId/contracts',
  validateRequestParams(GetContractByTenantSchema),
  getAllContractByTenantIdController
);

export default router;
