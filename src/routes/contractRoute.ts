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
  UpdateContractSchema,
} from '../validations/contractSchema';
import {
  createContractController,
  getAllContractController,
  getContractByIdController,
  updateContractController,
} from '../controllers/contractController';

const router = Router();

router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateContractSchema),
  createContractController
);

router.put(
  '/:contractId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(ContractIdSchema),
  validateRequestBody(UpdateContractSchema),
  updateContractController
);

router.get(
  '/show/:contractId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(ContractIdSchema),
  getContractByIdController
);

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllContractSchema),
  getAllContractController
);

export default router;
