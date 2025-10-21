import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createOccupantService,
  deleteOccupantService,
  getAllOccupantService,
  getByIdOccupantService,
  getByTenantIdOccupantService,
  updateOccupantService,
} from '../services/occupantService';

export async function getByIdOccupantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const occupant = await getByIdOccupantService(
      req.validatedParams.occupantId
    );
    successResponse(res, 'Occupant gets successfull.', { occupant }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getByTenantIdOccupantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const occupants = await getByTenantIdOccupantService(
      req.validatedParams.tenantId
    );
    successResponse(res, 'Occupants gets successfully.', { occupants }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getAllOccupantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getAllOccupantService(req);
    successResponse(res, 'All occupants get successfully', result, 200);
  } catch (error) {
    return next(error);
  }
}

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
