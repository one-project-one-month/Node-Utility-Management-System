import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createInvoiceService,
  getAllInvoicesService,
  getInvoiceService,
  updateInvoiceService,
} from '../services/invoiceService';

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
    const bills = await getAllInvoicesService();
    successResponse(res, 'Invoices fetched successfully', { bills }, 201);
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
      req.validatedParams.bill_id,
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
    const invoice_id = req.validatedParams;
    const fetchedBill = await getInvoiceService(invoice_id);

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
