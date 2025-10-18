import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceService,
  getTenantInvoiceLatestService,
  getTenantInvoiceHistoryService,
  updateInvoiceService,
} from '../services/invoiceService';
import { NotFoundError } from '../common/errors';

export async function createInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newInvoice = await createInvoiceService(req.validatedBody);

    successResponse(
      res,
      'Invoice created successfully',
      { invoice: newInvoice },
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function getAllInvoicesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = req.validatedQuery;
    const result = await getAllInvoicesService(query, req);
    if (!result.data.length) {
      return next(new NotFoundError('No found invoice.'));
    }
    successResponse(res, 'Invoices fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

export async function updateInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updatedInvoice = await updateInvoiceService(
      req.validatedParams,
      req.validatedBody
    );

    successResponse(
      res,
      'Bill updated successfully',
      { invoice: updatedInvoice },
      200
    );
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoiceId = req.validatedParams;
    const fetchedInvoice = await getInvoiceService(invoiceId);
    if (fetchedInvoice === null) {
      return next(new NotFoundError('No found invoice.'));
    }
    successResponse(
      res,
      'Invoice fetched successfully.',
      {
        invoice: fetchedInvoice,
      },
      200
    );
  } catch (error) {
    return next(error);
  }
}

export async function getTenantInvoiceLatestController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.validatedParams;
    const result = await getTenantInvoiceLatestService(tenantId);

    successResponse(
      res,
      'Invoice fetched successfully.',
      {
        invoice: result,
      },
      200
    );
  } catch (error) {
    return next(error);
  }
}
export async function getTenantInvoiceHistoryController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.validatedParams;
    const query = req.validatedQuery;
    const result = await getTenantInvoiceHistoryService(tenantId, query, req);

    successResponse(res, 'Invoice fetched successfully.', result, 200);
  } catch (error) {
    return next(error);
  }
}
