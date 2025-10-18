import { Request, Response, NextFunction } from 'express';
import {
  createContractTypeService,
  getAllContractTypeService,
  getByIdContractTypeService,
  updateContractTypeService,
} from '../services/contractTypeService';
import { successResponse } from '../common/apiResponse';

// @route POST | api/v1/contract-types
// @desc create new contract type
// @access Dashboard
export const createContractTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contractType = await createContractTypeService(req.validatedBody);
    successResponse(
      res,
      'Contract type created successfully',
      { contractType },
      201
    );
  } catch (error) {
    return next(error);
  }
};

// @route GET | api/v1/contract-types
// @desc get all contract types
// @access Dashboard
export const getAllContractTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contractTypes = await getAllContractTypeService();
    successResponse(
      res,
      'All Contract types fetched successfully',
      { data: contractTypes },
      200
    );
  } catch (error) {
    return next(error);
  }
};

// @route GET | api/v1/contract-types/:contractTypeId
// @desc get single contract type by Id
// @access Dashboard

export const getByIdContractTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contractType = await getByIdContractTypeService(
      req.validatedParams.contractTypeId
    );
    successResponse(
      res,
      'Contract type retrieved successfully',
      { contractType },
      200
    );
  } catch (error) {
    return next(error);
  }
};

// @route PUT | api/v1/contract-types/:contractTypeId
// @desc update existing contract type
// @access Dashboard
export const updateContractTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedContractType = await updateContractTypeService(
      req.validatedParams.contractTypeId,
      req.validatedBody
    );
    successResponse(
      res,
      'Contract type updated successfully',
      { contractType: updatedContractType },
      200
    );
  } catch (error) {
    return next(error);
  }
};
