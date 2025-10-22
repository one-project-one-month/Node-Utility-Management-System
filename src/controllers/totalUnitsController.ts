import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../common/errors';
import { successResponse } from '../common/apiResponse';
import {
  createTotalUnitService,
  getAllTotalUnitsService,
  getTotalUnitsByBillIdService,
  getTotalUnitsByIdService,
  updateTotalUnitsService,
} from '../services/totalUnitsService';

export async function getAllTotalUnitsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getAllTotalUnitsService(req);
    if (!result || !result.data.length)
      return next(new NotFoundError('No receipts found'));

    successResponse(res, 'Total-units fetched successfully', result);
  } catch (error) {
    return next(error);
  }
}

// Get by id
export async function getTotalUnitsByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const totalUnitsById = await getTotalUnitsByIdService(
      req.validatedParams.id
    );
    if (!totalUnitsById)
      return next(new NotFoundError('Total-units not found'));

    successResponse(res, 'Total-units by id fetched successfully', {
      data: totalUnitsById,
    });
  } catch (error) {
    return next(error);
  }
}

// Get latest by tenant id
export async function getTotalUnitsByBillIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const units = await getTotalUnitsByBillIdService(
      req.validatedParams.billId
    );

    if (!units)
      return next(new NotFoundError('Total-units by bill id not found'));

    successResponse(res, 'Total-units by bill id fetched successfully', {
      data: units,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTotalUnitsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newTotalUnits = await createTotalUnitService(req.validatedBody);

    successResponse(
      res,
      'Total-units created successfully',
      { data: newTotalUnits },
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function updateTotalUnitsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updatedUnits = await updateTotalUnitsService(
      req.validatedParams.id,
      req.validatedBody
    );

    successResponse(res, 'Total-units updated successfully', {
      data: updatedUnits,
    });
  } catch (error) {
    return next(error);
  }
}
