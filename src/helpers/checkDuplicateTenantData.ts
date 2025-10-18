import { BadRequestError } from '../common/errors/badRequestError';
import prisma from '../lib/prismaClient';

export const checkDuplicateTenantData = async (
  nrcs?: string[],
  email?: string,
  excludeTenantId?: string,
  excludeOccupantId?: string
) => {
  // Filter out undefined or empty NRCs
  const validNRCs = nrcs?.filter((v): v is string => !!v) ?? [];

  // Check nrc duplicates within request body
  const uniqueNRCs = new Set<string>();
  const duplicateNRCs = new Set<string>();

  for (const nrc of validNRCs) {
    if (uniqueNRCs.has(nrc)) duplicateNRCs.add(nrc);
    else uniqueNRCs.add(nrc);
  }
  const duplicateNrcsInRequest = [...duplicateNRCs];

  if (duplicateNrcsInRequest.length > 0) {
    throw new BadRequestError(`Duplicate NRCs found in request body`);
  }

  //  Check nrc duplicates in database
  const existingNrcsInTenants = validNRCs.length
    ? await prisma.tenant.findMany({
        where: {
          nrc: { in: validNRCs },
          ...(excludeTenantId && { NOT: { id: excludeTenantId } }),
        },
        select: { nrc: true },
      })
    : [];

  const existingNrcsInOccupants = validNRCs.length
    ? await prisma.occupant.findMany({
        where: {
          nrc: { in: validNRCs },
          ...(excludeOccupantId && { id: { not: excludeOccupantId } }),
        },
        select: { nrc: true },
      })
    : [];

  const duplicateNrcsInDB = [
    ...existingNrcsInTenants.map((tenant) => tenant.nrc),
    ...existingNrcsInOccupants.map((occupant) => occupant.nrc),
  ];

  if (duplicateNrcsInDB.length > 0) {
    throw new BadRequestError(`Some NRCs are already registered`);
  }

  // Check email already exists in database
  const existingEmail = email
    ? await prisma.tenant.findFirst({
        where: {
          email,
          NOT: { id: excludeTenantId },
        },
      })
    : null;

  if (existingEmail) {
    throw new BadRequestError(`Some emails are already registered`);
  }
};
