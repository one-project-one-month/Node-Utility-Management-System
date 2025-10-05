import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createCustomerService,
  cutomerServiceHistory,
  getAllCustomerService,
  getCustomerServiceById,
  updateCustomerService,
} from '../services/customerService';

//create customer service from client
export const createServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.validatedParams.id;

    const service = await createCustomerService(tenantId, req.validatedBody);

    successResponse(
      res,
      'Customer service created successfully',
      {
        service,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const serviceHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await cutomerServiceHistory(
      req.validatedParams,
      req.validatedQuery
    );
    successResponse(res, 'Fetch service history successfullly', result, 200);
  } catch (error) {
    next(error);
  }
};

// update customer service
export const updateServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = { id: req.validatedParams.id, ...req.validatedBody };

    const service = await updateCustomerService(data);
    successResponse(res, 'Customer service updated successfully', { service }, 200);
  } catch (error) {
    next(error);
  }
};

//get all customer services
export const getAllServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await getAllCustomerService(req.validatedQuery);
    successResponse(res, 'Fetch customer services successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

//get customer service by id
export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const service = await getCustomerServiceById(req.validatedParams.id);
    successResponse(
      res,
      'Fetch customer service by ID successfully',
      { service },
      200
    );
  } catch (error) {
    next(error);
  }
};
