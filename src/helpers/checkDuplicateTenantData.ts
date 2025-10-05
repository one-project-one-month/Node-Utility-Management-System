import { BadRequestError } from '../common/errors/badRequestError';
import prisma from '../lib/prismaClient';

async function checkDuplicate(dataArray?: string[], field?: 'emails' | 'nrcs', excludeTenantId?: string) {
  if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        ...(excludeTenantId && { id: { not: excludeTenantId } }),
        [field!]: { hasSome: dataArray },
      },
    });
    return existingTenant;
  }
}

export async function checkDuplicateTenantData(
  emails?: string[],
  nrcs?: string[],
  excludeTenantId?: string
): Promise<void> {

  //Check duplicate emails and nrcs in terms of "CLEAN CODE"
  const existingEmails = await checkDuplicate(emails, 'emails', excludeTenantId);
  if (existingEmails) {
      throw new BadRequestError(`Some emails are already registered`);
    }
  
  const existingNrcs = await checkDuplicate(nrcs, 'nrcs', excludeTenantId);
  if (existingNrcs) {
      throw new BadRequestError(`Some NRCs are already registered`);
  }

  // if (emails && Array.isArray(emails) && emails.length > 0) {
  //   const existingEmailTenant = await prisma.tenant.findFirst({
  //     where: {
  //       ...(excludeTenantId && { id: { not: excludeTenantId } }),
  //       emails: { hasSome: emails },
  //     },
  //   });

  //   if (existingEmailTenant) {
  //     throw new BadRequestError('Some emails are already registered');
  //   }
  // }

  // Check duplicate NRCs
  // if (nrcs && Array.isArray(nrcs) && nrcs.length > 0) {
  //   const existingNrcTenant = await prisma.tenant.findFirst({
  //     where: {
  //       ...(excludeTenantId && { id: { not: excludeTenantId } }),
  //       nrcs: { hasSome: nrcs },
  //     },
  //   });

  //   if (existingNrcTenant) {
  //     throw new BadRequestError('Some NRCs are already registered');
  //   }
  // }
}
