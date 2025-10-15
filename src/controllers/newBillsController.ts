import { Request, Response, NextFunction } from 'express';
import {
  createBillService,
  getAllBillsService,
  getBillHistoryByTenantIdService,
  getBillsByIdService,
  getLatestBillByTenantIdService,
  updateBillsService,
} from '../services/newBIllsService';
import { successResponse } from '../common/apiResponse';

export const createBillController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bill = await createBillService(req.validatedBody);
    successResponse(res, 'Bill created successfully', { bill }, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateBillController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bill = await updateBillsService(req.params.billId, req.validatedBody);
    successResponse(res, 'Bill updated successfully', { bill }, 200);
  } catch (error) {
    return next(error);
  }
};

export const getBillByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bill = await getBillsByIdService(req.params.billId);
    successResponse(res, 'Bill fetched successfully', { bill }, 200);
  } catch (error) {
    return next(error);
  }
};

export const getAllBillsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bills = await getAllBillsService(req.validatedQuery);
    successResponse(res, 'All Bills fetched successfully', { bills }, 200);
  } catch (error) {
    return next(error);
  }
};

export const getLatestBillByTenantIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const latestBill = await getLatestBillByTenantIdService(
      req.params.tenantId
    );
    successResponse(
      res,
      'Latest Bill fetched successfully',
      { latestBill },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export const getBillHistoryByTenantIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const billHistory = await getBillHistoryByTenantIdService(
      req.params.tenantId
    );
    successResponse(
      res,
      'Bill History fetched successfully',
      { billHistory },
      200
    );
  } catch (error) {
    return next(error);
  }
};
