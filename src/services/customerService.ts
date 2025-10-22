import { Request } from 'express';
import { NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateServiceType,
  TenantIdAndStatusType,
  UpdateServiceType,
} from '../validations/serviceSchema';
import { generatePaginationData } from '../common/utils/paginationHelper';

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
export const cutomerServiceHistory = async (req: Request) => {
  const { id, status } = req.validatedParams as TenantIdAndStatusType;
  const { page, limit } = req.validatedQuery as PaginationQueryType;

  const skip = (page - 1) * limit;

  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    select: { id: true, roomId: true },
  });

  if (!tenant) {
    throw new NotFoundError('Tenant not found');
  }

  //Get customer service history and total count
  const [historyServices, totalCount] = await Promise.all([
    prisma.customerService.findMany({
      where: {
        roomId: tenant.roomId,
        status,
      },
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
      where: {
        roomId: tenant.roomId,
        status,
      },
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

//get all cutomer service
export const getAllCustomerService = async (req: Request) => {
  const { page, limit } = req.validatedQuery as PaginationQueryType;
  const skip = (page - 1) * limit;

  //Get sevices and totalCount
  const [services, totalCount] = await Promise.all([
    prisma.customerService.findMany({
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
    prisma.customerService.count(),
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
