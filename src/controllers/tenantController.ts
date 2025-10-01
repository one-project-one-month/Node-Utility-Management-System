import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import { createTenantService } from '../services/tenantService';

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
