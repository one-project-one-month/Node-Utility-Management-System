import { Request } from 'express';
import { BadRequestError } from '../common/errors/badRequestError';
import { NotFoundError } from '../common/errors/notFoundError';
import { checkDuplicateTenantData } from '../helpers/checkDuplicateTenantData';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateTenantType,
  UpdateTenantType,
} from '../validations/tenantSchema';
import { generatePaginationData } from '../common/utils/paginationHelper';

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
    ...occupants
      .map((occupant) => occupant.nrc)
      .filter((nrc): nrc is string => !!nrc),
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
          relationship_to_tenant: occupant.relationship_to_tenant,
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

  // Check that the provided room_id exists
  const room = await prisma.room.findUnique({
    where: { id: data.room_id },
  });
  if (!room) throw new NotFoundError('Room not found.');

  // Ensure the provided room_id matches the tenant’s current room_id
  if (tenant.room_id !== data.room_id) {
    throw new BadRequestError(
      'RoomId mismatch: tenant is not assigned to this room.'
    );
  }

  // Ensure occupant belongs to this tenant
  if (data.occupant_id) {
    const occupant = await prisma.occupant.findUnique({
      where: { id: data.occupant_id },
    });

    if (!occupant || occupant.tenant_id !== tenant.id) {
      throw new BadRequestError('Invalid occupant for this tenant.');
    }
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

export async function getByIdTenantService(tenantId: string) {
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
}

export async function getAllTenantService(
  query: PaginationQueryType,
  req: Request
) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [tenants, totalCount] = await Promise.all([
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
  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: tenants,
    ...paginationData,
  };
}
