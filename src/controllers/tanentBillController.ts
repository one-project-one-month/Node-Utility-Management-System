import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  getTanentBillHistoryService,
  getTanentBillLatestService,
} from '../services/billService';

export async function getTanentBillLatestController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bills = await getTanentBillLatestService(req.validatedParams);
    successResponse(res, 'Bill fetched successfully', { bills }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getTanentBillHistoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('hello');
    const bills = await getTanentBillHistoryService(req.validatedParams);
    successResponse(res, 'Bill fetched successfully', { bills }, 201);
  } catch (error) {
    next(error);
  }
}
