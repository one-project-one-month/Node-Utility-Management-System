import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../common/errors/validationError';
import prisma from '../lib/prismaClient';
import { UpdateTenantSchema } from '../validations/tenantSchema';

export const validateUpdateTenantBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.validatedParams.tenantId;
    //Count current lengths to validate against schema
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        names: true,
        emails: true,
        nrcs: true,
      },
    });

    if (!existingTenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const expectedLengths = {
      names: existingTenant.names.length,
      emails: existingTenant.emails.length,
      nrcs: existingTenant.nrcs.length,
    };

    const schema = UpdateTenantSchema(expectedLengths);
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return next(new ValidationError(formattedErrors));
    }
    req.validatedBody = validation.data;
    next();
  } catch (error) {
    console.error('validateUpdateTenantBody error:', error);
    next(error);
  }
};
