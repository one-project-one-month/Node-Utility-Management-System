import { getBillsofLastFourMonth } from './../services/newBIllsService';
import { Request, Response, NextFunction } from 'express';
import {
  autoGenerateBillsService,
  createBillService,
  getAllBillsService,
  getBillHistoryByTenantIdService,
  getBillsByIdService,
  getLatestBillByTenantIdService,
  updateBillsService,
} from '../services/newBIllsService';
import { successResponse } from '../common/apiResponse';

export const billAutoGenerateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Call the service to auto-generate bills
    const numberOfRooms = await autoGenerateBillsService();
    successResponse(
      res,
      'Bills auto-generated successfully',
      {
        data: `Bill generated for ${numberOfRooms} rooms and sent invoices via mail`,
      },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export const createBillController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bill } = await createBillService(req.validatedBody);
    successResponse(res, 'Bill created successfully', { data: bill }, 201);
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
    const bill = await updateBillsService(
      req.validatedParams.billId,
      req.validatedBody
    );
    successResponse(res, 'Bill updated successfully', { data: bill }, 200);
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
    const bill = await getBillsByIdService(req.validatedParams.billId);
    successResponse(res, 'Bill fetched successfully', { data: bill }, 200);
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
    const bills = await getAllBillsService(req);
    successResponse(res, 'All Bills fetched successfully', bills, 200);
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
      req.validatedParams.tenantId
    );
    successResponse(
      res,
      'Latest Bill fetched successfully',
      { data: latestBill },
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
    const billHistory = await getBillHistoryByTenantIdService(req);
    successResponse(res, 'Bill History fetched successfully', billHistory, 200);
  } catch (error) {
    return next(error);
  }
};

export const getBillsofLastFourMonthController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalUnitsOfLastFourMonth = await getBillsofLastFourMonth();
    successResponse(
      res,
      'Total Units of Last Four Month fetched successfully',
      { data: totalUnitsOfLastFourMonth },
      200
    );
  } catch (error) {
    return next(error);
  }
};
