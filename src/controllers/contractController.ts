import { Request, Response, NextFunction } from 'express';
import {
  createContractService,
  getAllContractService,
  getContractByIdService,
  getAllContractsByTenantIdService,
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
    successResponse(
      res,
      'Contract created successfully',
      { data: contract },
      201
    );
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
    successResponse(
      res,
      'Contract updated successfully',
      { data: contract },
      200
    );
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
    successResponse(
      res,
      'Contract fetched successfully',
      { data: contract },
      200
    );
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
    const contracts = await getAllContractService(req);
    successResponse(res, 'All Contracts fetched successfully', contracts, 200);
  } catch (error) {
    return next(error);
  }
};

// @route GET | api/v1/tenants/:tenantId/contracts
// @desc get contract by tenant id
// @access Client
export const getAllContractsByTenantIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contract = await getAllContractsByTenantIdService(req);
    successResponse(
      res,
      'All Contracts fetched By tenantId successfully',
      contract,
      200
    );
  } catch (error) {
    return next(error);
  }
};
