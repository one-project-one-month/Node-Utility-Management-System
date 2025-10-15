import { Router } from 'express';
import { hasRole } from '../middlewares/authMiddleware';
import {
  validateRequestBody,
  validateRequestParams,
} from '../middlewares/validationMiddlware';
import {
  CreateContractTypeSchema,
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
router.get('/', hasRole(['Admin', 'Staff']), getAllContractTypeController);

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
