import { Request } from 'express';
import { NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateServiceType,
  GetAllServiceQueryType,
  TenantIdType,
  TenantServiceHistoryType,
  UpdateServiceType,
} from '../validations/serviceSchema';
import { generatePaginationData } from '../common/utils/paginationHelper';
import { Prisma } from '../../generated/prisma';

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

  // Check if roomId exists
  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
    select: { id: true },
  });

  if (!room) {
    throw new NotFoundError('Room not found');
  }

  return await prisma.customerService.create({ data });
};

//get service history by tenantId
export const customerServiceHistory = async (req: Request) => {
  const { id } = req.validatedParams as TenantIdType;
  const { page, limit, status } =
    req.validatedQuery as TenantServiceHistoryType;

  const skip = (page - 1) * limit;

  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!tenant) {
    throw new NotFoundError('Tenant not found');
  }

  const whereClause: Prisma.CustomerServiceWhereInput = {
    roomId: tenant.roomId,
  };

  if (status) {
    whereClause.status = status;
  }

  //Get customer service history and total count
  const [historyServices, totalCount] = await Promise.all([
    prisma.customerService.findMany({
      where: whereClause,
      include: {
        room: {
          select: {
            roomNo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.customerService.count({
      where: whereClause,
    }),
  ]);

  //Check historyServices exits
  if (!historyServices || historyServices.length === 0) {
    throw new NotFoundError('No customer service history found.');
  }

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  const data = historyServices.map((service) => {
    const { room, ...serviceWithoutRoom } = service;
    return {
      ...serviceWithoutRoom,
      roomNo: room.roomNo,
    };
  });

  return {
    data,
    ...paginationData,
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

//get all customer service
export const getAllCustomerService = async (req: Request) => {
  const { page, limit, status, priorityLevel, category, search } =
    req.validatedQuery as GetAllServiceQueryType;

  // skip amount per page
  const skip = (page - 1) * limit;

  //prisma where clause
  const where: Prisma.CustomerServiceWhereInput = {};

  //Status filter
  if (status) where.status = status;

  //Category filter
  if (category) where.category = category;

  //Priority filter
  if (priorityLevel) where.priorityLevel = priorityLevel;

  //Search filter
  if (!isNaN(Number(search))) {
    // Search by room number only when search is numeric
    where.room = {
      is: {
        roomNo: Number(search),
      },
    };
  } else {
    // Search by description only when search is string
    where.description = {
      contains: search,
      mode: 'insensitive',
    };
  }

  //Get services and totalCount
  const [services, totalCount] = await Promise.all([
    prisma.customerService.findMany({
      where,
      include: {
        room: {
          select: {
            roomNo: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.customerService.count({ where }),
  ]);

  if (Array.isArray(services) && services.length === 0) {
    throw new NotFoundError('No customer services found.');
  }

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  const data = services.map((service) => {
    const { room, ...serviceWithoutRoom } = service;
    return {
      ...serviceWithoutRoom,
      roomNo: room.roomNo,
    };
  });

  return {
    data,
    ...paginationData,
  };
};

//get customer service by id
export const getCustomerServiceById = async (id: string) => {
  const service = await prisma.customerService.findUnique({
    where: { id },
    include: { room: { select: { roomNo: true } } },
  });
  if (!service) {
    throw new NotFoundError(`No customer service found for Id-${id}`);
  }

  const { room, ...serviceWithoutRoom } = service;
  const data = {
    ...serviceWithoutRoom,
    roomNo: room.roomNo,
  };

  return data;
};

//delete customer service by id
export const deleteCustomerServiceById = async (id: string) => {
  const existingService = await prisma.customerService.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existingService) {
    throw new NotFoundError('No customer service found.');
  }

  return await prisma.customerService.delete({ where: { id } });
};
