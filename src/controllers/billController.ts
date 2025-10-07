import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createBillService,
  getAllBillsService,
  getBillService,
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
    const bills = await getAllBillsService(req.validatedQuery);
    successResponse(res, 'Bill fetched successfully', { bills }, 201);
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
      req.validatedParams.bill_id,
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
