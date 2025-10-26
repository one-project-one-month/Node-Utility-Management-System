import { Request } from 'express';
import { BadRequestError } from '../common/errors/badRequestError';
import { NotFoundError } from '../common/errors/notFoundError';
import { generatePaginationData } from '../common/utils/paginationHelper';
import { checkDuplicateTenantData } from '../helpers/checkDuplicateTenantData';
import prisma from '../lib/prismaClient';
import {
  CreateOccupantType,
  DeleteOccupantType,
  UpdateOccupantType,
} from '../validations/occupantSchema';
import { PaginationQueryType } from '../validations/paginationSchema';

export async function createOccupantService(data: CreateOccupantType) {
  // Check all tenantId values are the same
  const tenantIds = [...new Set(data.map((occupant) => occupant.tenantId))];
  if (tenantIds.length !== 1) {
    throw new BadRequestError('All occupants must belong to the same tenant');
  }
  const tenantId = tenantIds[0];

  // Check tenant exists
  const tenantExists = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });
  if (!tenantExists) {
    throw new NotFoundError(`Tenant with id ${tenantId} not found`);
  }

  //Gather all NRCs for duplicate check
  const allNrcsToCheck: string[] = [
    ...data.map((occupant) => occupant.nrc).filter((v): v is string => !!v),
  ];

  // Check for duplicates data
  await checkDuplicateTenantData(allNrcsToCheck);

  // Create data
  const createdOccupants = [];
  for (const occupant of data) {
    const created = await prisma.occupant.create({
      data: {
        tenantId: occupant.tenantId,
        name: occupant.name,
        nrc: occupant.nrc ?? null,
        relationshipToTenant: occupant.relationshipToTenant,
      },
    });
    createdOccupants.push(created);
  }
  return createdOccupants;
}

export async function updateOccupantService(
  occupantId: string,
  data: UpdateOccupantType
) {
  // Check occupant exists
  const existingOccupant = await prisma.occupant.findUnique({
    where: { id: occupantId },
  });
  if (!existingOccupant) {
    throw new NotFoundError('Occupant Not Found');
  }

  // Ensure occupant belongs to this tenant
  if (existingOccupant.tenantId !== data.tenantId) {
    throw new BadRequestError(
      'Tenant mismatch — occupant does not belong to the given tenant.'
    );
  }

  //Check for duplicates excluding the current tenant
  await checkDuplicateTenantData(
    data.nrc ? [data.nrc] : undefined,
    undefined,
    undefined,
    occupantId
  );

  // Finally update
  return await prisma.occupant.update({
    where: { id: occupantId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.nrc && { nrc: data.nrc }),
      ...(data.relationshipToTenant && {
        relationshipToTenant: data.relationshipToTenant,
      }),
    },
  });
}

export async function deleteOccupantService(
  occupantId: string,
  data: DeleteOccupantType
) {
  // Check occupant exists
  const existingOccupant = await prisma.occupant.findUnique({
    where: { id: occupantId },
  });
  if (!existingOccupant) {
    throw new NotFoundError('Occupant Not Found');
  }

  // Ensure occupant belongs to this tenant
  if (existingOccupant.tenantId !== data.tenantId) {
    throw new BadRequestError(
      'Tenant mismatch — cannot delete occupant from another tenant.'
    );
  }

  // Delete occupant
  return await prisma.occupant.delete({
    where: { id: occupantId },
  });
}

export async function getByIdOccupantService(occupantId: string) {
  const occupant = await prisma.occupant.findUnique({
    where: { id: occupantId },
    include: {
      tenant: true,
    },
  });
  if (!occupant) {
    throw new NotFoundError('Occupant Not Found');
  }
  return occupant;
}

export async function getByTenantIdOccupantService(tenantId: string) {
  const occupants = await prisma.occupant.findMany({
    where: { tenantId: tenantId },
    include: {
      tenant: true,
    },
  });
  if (occupants.length === 0) {
    throw new NotFoundError('No occupants found for the given tenantId');
  }
  return occupants;
}

export async function getAllOccupantService(req: Request) {
  const { page, limit } = req.validatedQuery as PaginationQueryType;
  const skip = (page - 1) * limit;

  const [occupants, totalCount] = await Promise.all([
    prisma.occupant.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tenant: true,
      },
    }),
    prisma.occupant.count(),
  ]);

  if (occupants.length === 0) {
    throw new NotFoundError('No occupants found');
  }
  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: occupants,
    ...paginationData,
  };
}
