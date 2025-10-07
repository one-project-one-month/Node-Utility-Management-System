import { Request, Response, NextFunction } from 'express';
import {
  createContractService,
  getAllContractSrvice,
  getContractByIdService,
  getContractByTenantService,
  updateContractService,
} from '../services/contractService';
import { successResponse } from '../common/apiResponse';

// @route POST | api/v1/contracts
// @desc create new contract
// @access Dashboard
export const createContractController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await createContractService(req.validatedBody);
    successResponse(res, 'Contract created successfully', { contract }, 201);
  } catch (error) {
    return next(error);
  }
};

// @route PUT | api/v1/contracts
// @desc update existing contract
// @access Dashboard
export const updateContractController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await updateContractService(
      req.params.contractId,
      req.validatedBody
    );
    successResponse(res, 'Contract updated successfully', { contract }, 200);
  } catch (error) {
    return next(error);
  }
};

// @route GET | api/v1/contracts/show
// @desc get a contract by contractId
// @access Dashboard
export const getContractByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await getContractByIdService(req.params.contractId);
    successResponse(res, 'Contract fetched successfully', { contract }, 200);
  } catch (error) {
    return next(error);
  }
};

// @route GET | api/v1/contracts
// @desc get all contract
// @access Dashboard
export const getAllContractController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await getAllContractSrvice(req.validatedQuery);
    successResponse(
      res,
      'All Contracts fetched successfully',
      { contract },
      200
    );
  } catch (error) {
    return next(error);
  }
};

// @route GET | api/v1/tenants/:tenantId/contracts
// @desc get all contracts by tenant
// @access Client
export const getAllContractByTenantIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await getContractByTenantService(req.params.tenantId);
    successResponse(
      res,
      'All Contracts fetched By tenantId successfully',
      { contract },
      200
    );
  } catch (error) {
    return next(error);
  }
};
