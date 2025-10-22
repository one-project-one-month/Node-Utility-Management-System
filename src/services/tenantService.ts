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
    phoneNo,
    emergencyNo,
    occupants = [],
    roomId,
  } = data;
  //Check if room exists
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    throw new BadRequestError('Room not found');
  }

  const existingTenantForRoom = await prisma.tenant.findUnique({
    where: { roomId },
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
      phoneNo,
      emergencyNo,
      roomId,
      occupants: {
        create: occupants.map((occupant) => ({
          name: occupant.name,
          nrc: occupant.nrc ?? null,
          relationshipToTenant: occupant.relationshipToTenant,
        })),
      },
    },
    include: {
      occupants: true,
      room: true,
      contract: {
        include: {
          contractType: true,
        },
      },
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

  // Check that the provided roomId exists
  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
  });
  if (!room) throw new NotFoundError('Room not found.');

  // Ensure the provided roomId matches the tenant’s current roomId
  if (tenant.roomId !== data.roomId) {
    throw new BadRequestError(
      'RoomId mismatch: tenant is not assigned to this room.'
    );
  }

  // Ensure occupant belongs to this tenant
  if (data.occupantId) {
    const occupant = await prisma.occupant.findUnique({
      where: { id: data.occupantId },
    });

    if (!occupant || occupant.tenantId !== tenant.id) {
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
      ...(data.phoneNo && { phoneNo: data.phoneNo }),
      ...(data.emergencyNo && { emergencyNo: data.emergencyNo }),
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

export async function getAllTenantService(req: Request) {
  const { page, limit } = req.validatedQuery as PaginationQueryType;
  const skip = (page - 1) * limit;

  const [tenants, totalCount] = await Promise.all([
    prisma.tenant.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        occupants: true,
        contract: {
          include: {
            contractType: true,
          },
        },
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
