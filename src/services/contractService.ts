import { Request } from 'express';
import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateContractSchemaType,
  UpdateContractSchemaType,
} from '../validations/contractSchema';
import { PaginationQueryType } from '../validations/paginationSchema';
import { generatePaginationData } from '../common/utils/paginationHelper';

export const createContractService = async (data: CreateContractSchemaType) => {
  // check room exists
  const room = await prisma.room.findUnique({
    where: { id: data.room_id },
    select: { id: true },
  });
  if (!room) throw new NotFoundError('Room not found');

  // check room has tenant
  const existingTenant = await prisma.tenant.findUnique({
    where: { id: data.tenant_id },
    select: { id: true, room_id: true },
  });
  if (existingTenant?.room_id)
    throw new BadRequestError('Room already has a tenant');
  if (!existingTenant?.id) throw new NotFoundError('Tenant not found');

  // check contract type exists
  const contractType = await prisma.contractType.findUnique({
    where: { id: data.contract_type_id },
    select: { id: true },
  });
  if (!contractType) throw new NotFoundError('Contract type not found');

  // check if contract already exists
  const existingContract = await prisma.contract.findUnique({
    where: { tenant_id: data.tenant_id },
    select: { id: true },
  });
  if (existingContract)
    throw new BadRequestError('Tenant already has a contract');

  return await prisma.contract.create({
    data,
  });
};

export const updateContractService = async (
  contractId: string,
  data: UpdateContractSchemaType
) => {
  const {
    room_id,
    contract_type_id,
    tenant_id,
    created_date,
    expiry_date,
    updated_date,
  } = data;
  // Check if contract exists
  const existingContract = await prisma.contract.findUnique({
    where: { id: contractId },
  });
  if (!existingContract) throw new NotFoundError('Contract not found');

  const room = await prisma.room.findUnique({
    where: { id: data.room_id },
    select: { id: true },
  });
  if (!room) throw new NotFoundError('Room not found');

  // check room has tenant
  const existingTenant = await prisma.tenant.findUnique({
    where: { id: data.tenant_id },
    select: { id: true },
  });
  if (!existingTenant?.id) throw new NotFoundError('Tenant not found');

  // check contract type exists
  const contractType = await prisma.contractType.findUnique({
    where: { id: data.contract_type_id },
    select: { id: true },
  });
  if (!contractType) throw new NotFoundError('Contract type not found');

  return await prisma.contract.update({
    where: { id: contractId },
    data: {
      ...(room_id && { room_id }),
      ...(contract_type_id && { contract_type_id }),
      ...(tenant_id && { tenant_id }),
      ...(created_date && { created_date }),
      ...(expiry_date && { expiry_date }),
      ...(updated_date && { updated_date }),
    },
  });
};

export const getContractByIdService = async (contractId: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      tenant: true,
      room: true,
      contract_type: true,
    },
  });
  if (!contract) throw new NotFoundError('Contract not found');
  return contract;
};

export const getAllContractService = async (
  query: PaginationQueryType,
  req: Request
) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Get contracts & totalCount
  const [contracts, totalCount] = await prisma.$transaction([
    prisma.contract.findMany({
      skip,
      take: limit,
      include: {
        tenant: true,
        room: true,
        contract_type: true,
      },
      orderBy: { created_date: 'desc' },
    }),
    prisma.contract.count(),
  ]);

  if (Array.isArray(contracts) && !contracts.length)
    throw new NotFoundError('Contracts not found');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    contracts,
    ...paginationData,
  };
};

// get contract by tenantId
export const getContractByTenantIdService = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  return await prisma.contract.findUnique({
    where: { tenant_id: tenant.id },
    include: {
      tenant: true,
      room: true,
      contract_type: true,
    },
  });
};
