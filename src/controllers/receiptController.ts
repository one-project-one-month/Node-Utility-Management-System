import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../common/errors';
import { successResponse } from '../common/apiResponse';
import {
  createReceiptService,
  getAllReceiptsService,
  getReceiptByIdService,
  getReceiptByInvoiceIdService,
  updateReceiptService,
} from '../services/receiptService';

export async function getAllReceiptsController(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // const filters = req.validatedQuery;
    const receipts = await getAllReceiptsService();
    if (!receipts || !receipts.length)
      throw new NotFoundError('No receipts found');

    successResponse(res, 'Receipts fetched successfully', { receipts });
  } catch (error) {
    console.log('Error in getAllReceiptsController:', error);
    next(error);
  }
}

export async function getReceiptByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const receipt = await getReceiptByIdService(req.validatedParams.id)
    if (!receipt) throw new NotFoundError('Receipt not found');

    successResponse(res, 'Receipt fetched successfully', { receipt });
  } catch (error) {
    next(error);
  }
}

export async function getReceiptByInvoiceIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const receiptByInvoiceId = await getReceiptByInvoiceIdService(
      req.validatedParams.invoiceId
    );

    if (!receiptByInvoiceId)
      throw new NotFoundError('Receipt not found for this invoice');

    successResponse(res, 'Receipt fetched successfully', {
      receipt: receiptByInvoiceId,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReceiptController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newReceipt = await createReceiptService(req.validatedBody);

    successResponse(
      res,
      'Receipt created successfully',
      { receipt: newReceipt },
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function updateReceiptController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updatedReceipt = await updateReceiptService(
      req.validatedParams.id,
      req.validatedBody
    );

    successResponse(res, 'Receipt updated successfully', {
      receipt: updatedReceipt,
    });
  } catch (error) {
    next(error);
  }
}
