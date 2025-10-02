import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createTenantService,
  updateTenantService,
} from '../services/tenantService';

export async function createTenantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenants = await createTenantService(req.validatedBody);
    successResponse(res, 'Tenants created successfully', tenants, 201);
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
