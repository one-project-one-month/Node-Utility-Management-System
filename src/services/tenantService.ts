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
import { generatePaginationData } from '../common/utils/pagination-helper';

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
    throw new BadRequestError('Room already occupied!');

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

export const getAllTenantService = async (
  query: PaginationQueryType,
  req: Request
) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Get tenants & totalCount
  const [tenants, totalCount] = await Promise.all([
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

  if (tenants.length === 0) {
    throw new NotFoundError('No tenants found');
  }

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    tenants,
    ...paginationData,
  };
};
