import { BadRequestError } from '../common/errors/badRequestError';
import prisma from '../lib/prismaClient';

export async function checkDuplicateTenantData(
  emails?: string[],
  nrcs?: string[],
  excludeTenantId?: string
): Promise<void> {
  //Check duplicate emails
  if (emails && Array.isArray(emails) && emails.length > 0) {
    const existingEmailTenant = await prisma.tenant.findFirst({
      where: {
        ...(excludeTenantId && { id: { not: excludeTenantId } }),
        emails: { hasSome: emails },
      },
    });

    if (existingEmailTenant) {
      throw new BadRequestError('Some emails are already registered');
    }
  }

  // Check duplicate NRCs
  if (nrcs && Array.isArray(nrcs) && nrcs.length > 0) {
    const existingNrcTenant = await prisma.tenant.findFirst({
      where: {
        ...(excludeTenantId && { id: { not: excludeTenantId } }),
        nrcs: { hasSome: nrcs },
      },
    });

    if (existingNrcTenant) {
      throw new BadRequestError('Some NRCs are already registered');
    }
  }
}
