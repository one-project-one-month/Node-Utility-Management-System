import { BadRequestError } from '../common/errors/badRequestError';
import { NotFoundError } from '../common/errors/notFoundError';
import { checkDuplicateTenantData } from '../helpers/checkDuplicateTenantData';
import prisma from '../lib/prismaClient';
import {
  CreateTenantType,
  GetAllTenantsQueryType,
  UpdateTenantType,
} from '../validations/tenantSchema';

export async function createTenantService(data: CreateTenantType) {
  //Check if room exists
  const room = await prisma.room.findUnique({ where: { id: data.room_id } });
  if (!room) {
    throw new BadRequestError('Room not found');
  }

  const existingTenantForRoom = await prisma.tenant.findUnique({
    where: { room_id: data.room_id },
  });

  if (existingTenantForRoom)
    throw new BadRequestError('Room already has a tenant');

  //Check for duplicate emails & nrcs before creating
  await checkDuplicateTenantData(data.emails, data.nrcs);

  return await prisma.tenant.create({
    data,
  });
}

export async function updateTenantService(
  tenantId: string,
  data: UpdateTenantType
) {
  //check tenant
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new NotFoundError('Tenant not found');

  //Check for duplicates excluding the current tenant
  await checkDuplicateTenantData(data.emails, data.nrcs, tenantId);

  // Finally update
  return await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(data.names && { names: { set: data.names } }),
      ...(data.emails && { emails: { set: data.emails } }),
      ...(data.nrcs && { nrcs: { set: data.nrcs } }),
      ...(data.phone_nos && { phone_nos: { set: data.phone_nos } }),
      ...(data.emergency_nos && { emergency_nos: { set: data.emergency_nos } }),
      updated_at: new Date(),
    },
  });
}

export const getByIdTenantService = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    throw new NotFoundError('Tenant Not Found');
  }
  return tenant;
};

export const getAllTenantService = async (data: GetAllTenantsQueryType) => {
  const { page, limit } = data;
  const skip = (page - 1) * limit;

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        room: true,
      },
    }),
    prisma.tenant.count(),
  ]);

  return {
    tenants,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
