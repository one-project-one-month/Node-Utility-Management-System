import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createBillService,
  getAllBillsService,
  getBillService,
  getTanentBillHistoryService,
  getTanentBillLatestService,
  updateBillService,
} from '../services/billService';

export async function createBillController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newBill = await createBillService(req.validatedBody);
    successResponse(res, 'Bill created successfully', { bill: newBill }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getAllBillsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getAllBillsService(req.validatedQuery);
    successResponse(
      res,
      'Bill fetched successfully',
      { bills: result.bills, pagination: result.pagination },
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function updateBillController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updateBill = await updateBillService(
      req.validatedParams.billId,
      req.validatedBody
    );

    successResponse(
      res,
      'Bill updated successfully',
      { bill: updateBill },
      200
    );
  } catch (error) {
    next(error);
  }
}

export async function getBillController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bill_id = req.validatedParams;
    const fetchedBill = await getBillService(bill_id);

    successResponse(
      res,
      'Bill fetched successfully.',
      {
        bill: fetchedBill,
      },
      200
    );
  } catch (error) {
    return next(error);
  }
}

//For tenant to view their bills

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
    const bills = await getTanentBillHistoryService(
      req.validatedParams,
      req.validatedQuery
    );
    successResponse(res, 'Bill fetched successfully', { bills }, 201);
  } catch (error) {
    next(error);
  }
}
