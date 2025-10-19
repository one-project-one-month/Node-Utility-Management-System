import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../common/errors';
import { successResponse } from '../common/apiResponse';
import {
  createReceiptService,
  getAllReceiptsService,
  getLatestReceiptByTenantIdService,
  getReceiptByIdService,
  getReceiptByInvoiceIdService,
  getReceiptHistoriesByTenantIdService,
  updateReceiptService,
} from '../services/receiptService';

export async function getAllReceiptsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getAllReceiptsService(req.validatedQuery, req);
    if (!result || !result.data || !result.data.length)
      return next(new NotFoundError('No receipts found'));

    successResponse(res, 'Receipts fetched successfully', result);
  } catch (error) {
    return next(error);
  }
}

// Get by id
export async function getReceiptByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const receipt = await getReceiptByIdService(req.validatedParams.id);
    if (!receipt) return next(new NotFoundError('Receipt not found'));

    successResponse(res, 'Receipt fetched successfully', { receipt });
  } catch (error) {
    return next(error);
  }
}

// Get latest by tenant id
export async function getLatestReceiptByTenantIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const latestReceipt = await getLatestReceiptByTenantIdService(
      req.validatedParams.tenantId
    );

    if (!latestReceipt)
      return next(new NotFoundError('Latest receipt not found'));

    successResponse(res, 'Latest receipts by tenant id fetched successfully', {
      data: latestReceipt,
    });
  } catch (error) {
    return next(error);
  }
}

// Get receipt history by tenant id
export async function getReceiptHistoriesByTenantIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getReceiptHistoriesByTenantIdService(
      req.validatedParams.tenantId,
      req.validatedQuery,
      req
    );

    if (!result.data || !result.data.length)
      return next(new NotFoundError('Receipt histories are not found'));

    successResponse(
      res,
      'Receipt histories by tenant id fetched successfully',
      result
    );
  } catch (error) {
    return next(error);
  }
}

// Get by invoice id
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
      return next(new NotFoundError('Receipt not found for this invoice'));

    successResponse(res, 'Receipt fetched successfully', {
      receipt: receiptByInvoiceId,
    });
  } catch (error) {
    return next(error);
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
    return next(error);
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
    return next(error);
  }
}
