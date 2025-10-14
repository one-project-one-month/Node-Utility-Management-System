import { BadRequestError } from '../common/errors/badRequestError';
import { NotFoundError } from '../common/errors/notFoundError';
import { checkDuplicateTenantData } from '../helpers/checkDuplicateTenantData';

import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateTenantType,
  UpdateTenantType,
} from '../validations/tenantSchema';

export async function createTenantService(data: CreateTenantType) {
  const {
    name,
    nrc,
    email,
    phone_no,
    emergency_no,
    occupants = [],
    room_id,
  } = data;
  //Check if room exists
  const room = await prisma.room.findUnique({ where: { id: room_id } });
  if (!room) {
    throw new BadRequestError('Room not found');
  }

  const existingTenantForRoom = await prisma.tenant.findUnique({
    where: { room_id },
  });

  if (existingTenantForRoom)
    throw new BadRequestError('Room already occupied!');

  //Gather all NRCs for duplicate check
  const allNrcsToCheck: string[] = [
    nrc,
    ...occupants.map((occ) => occ.nrc).filter((v): v is string => !!v),
  ];

  //Check for duplicates tenant data
  await checkDuplicateTenantData(allNrcsToCheck, email);

  return await prisma.tenant.create({
    data: {
      name,
      nrc,
      email,
      phone_no,
      emergency_no,
      room_id,
      occupants: {
        create: occupants.map((occupant) => ({
          name: occupant.name,
          nrc: occupant.nrc ?? null,
          relationship_to_tenant: occupant.relationshipToTenant,
        })),
      },
    },
    include: {
      occupants: true,
      room: true,
    },
  });
}

export async function updateTenantService(
  tenantId: string,
  data: UpdateTenantType
) {
  //check tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { occupants: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  // Ensure occupant belongs to this tenant
  const occupant = await prisma.occupant.findUnique({
    where: { id: data.occupant_id },
  });

  if (!occupant || occupant.tenant_id !== tenant.id) {
    throw new BadRequestError('Invalid occupant for this tenant.');
  }

  //Check for duplicates excluding the current tenant
  await checkDuplicateTenantData(
    data.nrc ? [data.nrc] : undefined,
    data.email ?? undefined,
    tenantId
  );

  // Finally update
  return await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.nrc && { nrc: data.nrc }),
      ...(data.phone_no && { phone_no: data.phone_no }),
      ...(data.emergency_no && { emergency_no: data.emergency_no }),
    },
    include: {
      occupants: true,
      room: true,
    },
  });
}

export const getByIdTenantService = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      room: true,
      occupants: true,
    },
  });
  if (!tenant) {
    throw new NotFoundError('Tenant Not Found');
  }
  return tenant;
};

export const getAllTenantService = async (query: PaginationQueryType) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [tenants, count] = await Promise.all([
    prisma.tenant.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        room: true,
        occupants: true,
      },
    }),
    prisma.tenant.count(),
  ]);

  if (tenants.length === 0) {
    throw new NotFoundError('No tenants found');
  }
  const totalPages = Math.ceil(count / limit);

  const pagination = {
    count: tenants.length,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalPages,
    totalCount: count,
  };

  return {
    tenants,
    pagination,
  };
};
