import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createOccupantService,
  deleteOccupantService,
  updateOccupantService,
} from '../services/occupantService';

export async function createOccupantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const occupant = await createOccupantService(req.validatedBody);
    successResponse(res, 'Occupant created successfully', { occupant }, 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateOccupantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updatedOccupant = await updateOccupantService(
      req.validatedParams.occupantId,
      req.validatedBody
    );
    successResponse(
      res,
      'Occupant updated successfully',
      { occupant: updatedOccupant },
      200
    ); // Not 201
  } catch (error) {
    return next(error);
  }
}

export async function deleteOccupantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const deletedOccupant = await deleteOccupantService(
      req.validatedParams.occupantId,
      req.validatedBody
    );
    successResponse(res, 'Occupant deleted successfully', {
      occupant: deletedOccupant,
    });
  } catch (error) {
    return next(error);
  }
}
