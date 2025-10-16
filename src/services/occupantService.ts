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
  // Check all tenant_id values are the same
  const tenantIds = [...new Set(data.map((occupant) => occupant.tenant_id))];
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
        tenant_id: occupant.tenant_id,
        name: occupant.name,
        nrc: occupant.nrc ?? null,
        relationship_to_tenant: occupant.relationship_to_tenant,
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
  if (existingOccupant.tenant_id !== data.tenant_id) {
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
      ...(data.relationship_to_tenant && {
        relationship_to_tenant: data.relationship_to_tenant,
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
  if (existingOccupant.tenant_id !== data.tenant_id) {
    throw new BadRequestError(
      'Tenant mismatch — cannot delete occupant from another tenant.'
    );
  }

  // Delete occupant
  await prisma.occupant.delete({
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

export async function getAllOccupantService(
  query: PaginationQueryType,
  req: Request
) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [occupants, totalCount] = await Promise.all([
    prisma.occupant.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
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
    occupants,
    ...paginationData,
  };
}
