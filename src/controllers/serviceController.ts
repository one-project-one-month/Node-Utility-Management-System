import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createCustomerService,
  customerServiceHistory,
  deleteCustomerServiceById,
  getAllCustomerService,
  getCustomerServiceById,
  getCustomerServiceCount,
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
        data: service,
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
    const result = await customerServiceHistory(req);
    successResponse(res, 'Fetch service history successfully', result, 200);
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
    const service = await updateCustomerService(
      req.validatedParams.id,
      req.validatedBody
    );
    successResponse(
      res,
      'Customer service updated successfully',
      { data: service },
      200
    );
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
    const result = await getAllCustomerService(req);
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
      { data: service },
      200
    );
  } catch (error) {
    next(error);
  }
};

//delete customer service by id
export const deleteServiceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const service = await deleteCustomerServiceById(req.validatedParams.id);
    successResponse(
      res,
      'Delete customer service by ID successfully',
      { data: service },
      200
    );
  } catch (error) {
    next(error);
  }
};

//get customer service counts
export const getServiceCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalCounts = await getCustomerServiceCount(req);
    successResponse(
      res,
      'Get customer service counts successfully',
      { data: totalCounts },
      200
    );
  } catch (error) {
    next(error);
  }
};
