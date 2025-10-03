import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createTenantService,
  getAllTenantService,
  getByIdTenantService,
  updateTenantService,
} from '../services/tenantService';

export const getByIdTenantController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenant = await getByIdTenantService(req.validatedParams.tenantId);
    successResponse(res, 'Tenant gets successfull.', { tenant }, 200);
  } catch (error) {
    next(error);
  }
};

export const getAllTenantController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenants = await getAllTenantService(req.validatedQuery);
    successResponse(res, 'All tenants get successfully', tenants, 200);
  } catch (error) {
    next(error);
  }
};

export async function createTenantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenant = await createTenantService(req.validatedBody);
    successResponse(res, 'Tenant created successfully', tenant, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateTenantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updatedTenants = await updateTenantService(
      req.validatedParams.tenantId,
      req.validatedBody
    );
    successResponse(res, 'Tenants updated successfully', updatedTenants, 201);
  } catch (error) {
    next(error);
  }
}
