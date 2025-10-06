import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware';
import {
  CreateContractTypeSchema,
  GetAllContractTypesQuerySchema,
  GetContractTypeParamSchema,
  UpdateContractTypeSchema,
} from '../validations/contractTypeSchema';
import {
  createContractTypeController,
  getAllContractTypeController,
  getByIdContractTypeController,
  updateContractTypeController,
} from '../controllers/contractTypeController';

const router = Router();

// create new contract type
router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateContractTypeSchema),
  createContractTypeController
);

// get all contract types
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllContractTypesQuerySchema),
  getAllContractTypeController
);

// get contract type by id
router.get(
  '/:contractTypeId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetContractTypeParamSchema),
  getByIdContractTypeController
);

// update contract type
router.put(
  '/:contractTypeId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(GetContractTypeParamSchema),
  validateRequestBody(UpdateContractTypeSchema),
  updateContractTypeController
);

export default router;
