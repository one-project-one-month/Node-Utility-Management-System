import { NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateServiceType,
  TenantIdAndStatusType,
  UpdateServiceType,
} from '../validations/serviceSchema';

//create customer service
export const createCustomerService = async (
  tenantId: string,
  data: CreateServiceType
) => {
  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });

  if (!tenant) {
    throw new NotFoundError('Tenant not found');
  }

  // Check if room_id exists
  const room = await prisma.room.findUnique({
    where: { id: data.room_id },
    select: { id: true },
  });

  if (!room) {
    throw new NotFoundError('Room not found');
  }

  return await prisma.customerService.create({ data });
};

//get service history by tenantId
export const cutomerServiceHistory = async (
  { id, status }: TenantIdAndStatusType,
  { page, limit }: PaginationQueryType
) => {
  const skip = (page - 1) * limit;
  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    select: { id: true, room_id: true },
  });

  if (!tenant) {
    throw new NotFoundError('Tenant not found');
  }

  //Get customer service history and total count
  const [history, total] = await Promise.all([
    prisma.customerService.findMany({
      where: {
        room_id: tenant.room_id,
        status,
      },
      skip,
      take: limit,
    }),
    prisma.customerService.count({
      where: {
        room_id: tenant.room_id,
        status,
      },
    }),
  ]);

  //Check history exits
  if (!history || history.length === 0) {
    throw new NotFoundError('No customer service history found.');
  }

  //Total pages for pagination
  const totalPages = Math.ceil(total / limit);

  const pagination = {
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalPages,
  };

  return {
    history,
    pagination,
  };
};

//update customer service
export const updateCustomerService = async (
  serviceId: string,
  data: UpdateServiceType
) => {
  const existingService = await prisma.customerService.findUnique({
    where: { id: serviceId },
    select: { id: true },
  });
  if (!existingService) {
    throw new NotFoundError(`No customer service found.}`);
  }

  return await prisma.customerService.update({
    where: { id: serviceId },
    data,
  });
};

//get all cutomer service
export const getAllCustomerService = async ({
  page,
  limit,
}: PaginationQueryType) => {
  const skip = (page - 1) * limit;

  //Get sevices and count
  const [services, count] = await Promise.all([
    prisma.customerService.findMany({
      skip,
      take: limit,
    }),
    prisma.customerService.count(),
  ]);

  if (Array.isArray(services) && services.length === 0) {
    throw new NotFoundError('No customer services found.');
  }

  //Total pages for pagination
  const totalPages = Math.ceil(count / limit);

  return {
    services,
    pagination: {
      count: services.length,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      page,
      limit,
      totalPages,
    },
  };
};

//get customer service by id
export const getCustomerServiceById = async (id: string) => {
  const service = await prisma.customerService.findUnique({ where: { id } });
  if (!service) {
    throw new NotFoundError(`No customer service found for Id-${id}`);
  }
  return service;
};
