import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  getTenantBillHistoryService,
  getTenantBillLatestService,
} from '../services/billService';

export async function getTenantBillLatestController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bills = await getTenantBillLatestService(req.validatedParams);
    successResponse(res, 'Bill fetched successfully', { bills }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getTenantBillHistoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('hello');
    const bills = await getTenantBillHistoryService(req.validatedParams);
    successResponse(res, 'Bill fetched successfully', { bills }, 201);
  } catch (error) {
    next(error);
  }
}
