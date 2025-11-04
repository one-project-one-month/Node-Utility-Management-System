import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  createTenantService,
  getActiveTenantCountService,
  getAllTenantService,
  getByIdTenantService,
  updateTenantService,
} from '../services/tenantService';

export async function getByIdTenantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenant = await getByIdTenantService(req.validatedParams.tenantId);
    successResponse(res, 'Tenant gets successful.', { data: tenant }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getAllTenantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getAllTenantService(req);
    successResponse(res, 'All tenants get successfully', result, 200);
  } catch (error) {
    return next(error);
  }
}

export async function createTenantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenant = await createTenantService(req.validatedBody);
    successResponse(res, 'Tenant created successfully', { data: tenant }, 201);
  } catch (error) {
    return next(error);
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
    successResponse(
      res,
      'Tenants updated successfully',
      { data: updatedTenants },
      200
    ); // Not 201
  } catch (error) {
    return next(error);
  }
}

export async function getActiveTenantCountController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const activeTenantCount = await getActiveTenantCountService();
    successResponse(
      res,
      'Active tenant count gets successfully',
      { data: activeTenantCount },
      200
    );
  } catch (error) {
    return next(error);
  }
}
