import { BadRequestError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateContractSchemaType,
  GetAllContractSchemaType,
  UpdateContractSchemaType,
} from '../validations/contractSchema';

export const createContractService = async (data: CreateContractSchemaType) => {
  const { roomNo, contractTypeId, tenantId, createdDate, expiryDate } = data;

  // check room exists
  const room = await prisma.room.findUnique({
    where: { room_no: roomNo },
    select: { id: true },
  });
  if (!room) throw new BadRequestError('Room not found');

  // check room has tenant
  const existingTenant = await prisma.tenant.findUnique({
    where: { room_id: room.id },
    select: { id: true },
  });
  if (existingTenant) throw new BadRequestError('Room already has a tenant');

  // check contract type exists
  const contractType = await prisma.contractType.findUnique({
    where: { id: contractTypeId },
    select: { id: true },
  });
  if (!contractType) throw new BadRequestError('Contract type not found');

  // check tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });
  if (!tenant) throw new BadRequestError('Tenant not found');

  // check if contract already exists
  const existingContract = await prisma.contract.findUnique({
    where: { tenant_id: tenant.id },
    select: { id: true },
  });
  if (existingContract)
    throw new BadRequestError('That tenant already has a contract');

  return await prisma.contract.create({
    data: {
      room_id: room.id,
      tenant_id: tenant.id,
      contract_type_id: contractType.id,
      created_date: new Date(createdDate),
      expiry_date: new Date(expiryDate),
      updated_date: new Date(),
    },
  });
};

export const updateContractService = async (
  contractId: string,
  data: UpdateContractSchemaType
) => {
  const { roomNo, contractTypeId, tenantId, createdDate, expiryDate } = data;

  // Check if contract exists
  const existingContract = await prisma.contract.findUnique({
    where: { id: contractId },
  });
  if (!existingContract) throw new BadRequestError('Contract not found');

  // If user wants to change room
  let roomId: string | undefined;
  if (roomNo) {
    const room = await prisma.room.findUnique({
      where: { room_no: roomNo },
      select: { id: true },
    });
    if (!room) throw new BadRequestError('Room not found');

    // Check if that room is already linked to another contract
    const roomHasContract = await prisma.contract.findFirst({
      where: {
        room_id: room.id,
        NOT: { id: contractId }, // exclude current contract
      },
      select: { id: true },
    });
    if (roomHasContract)
      throw new BadRequestError(
        'That room is already linked to another contract'
      );

    roomId = room.id;
  }

  // If user wants to change tenant
  if (tenantId) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
    if (!tenant) throw new BadRequestError('Tenant not found');

    // Check if tenant already has another contract
    const tenantHasContract = await prisma.contract.findFirst({
      where: {
        tenant_id: tenant.id,
        NOT: { id: contractId },
      },
      select: { id: true },
    });
    if (tenantHasContract)
      throw new BadRequestError(
        'That tenant is already linked to another contract'
      );
  }

  // If user wants to change contract type
  if (contractTypeId) {
    const contractType = await prisma.contractType.findUnique({
      where: { id: contractTypeId },
      select: { id: true },
    });
    if (!contractType) throw new BadRequestError('Contract type not found');
  }

  return await prisma.contract.update({
    where: { id: contractId },
    data: {
      ...(roomId && { room_id: roomId }),
      ...(contractTypeId && { contract_type_id: contractTypeId }),
      ...(tenantId && { tenant_id: tenantId }),
      ...(createdDate && { created_date: new Date(createdDate) }),
      ...(expiryDate && { expiry_date: new Date(expiryDate) }),
      updated_date: new Date(),
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
  if (!contract) throw new BadRequestError('Contract not found');
  return contract;
};

export const getAllContractSrvice = async (data: GetAllContractSchemaType) => {
  const { page, limit } = data;
  const skip = (page - 1) * limit;

  const [contracts, count] = await prisma.$transaction([
    prisma.contract.findMany({
      skip,
      take: limit,
      include: {
        tenant: true,
        room: true,
        contract_type: true,
      },
    }),
    prisma.contract.count(),
  ]);

  if (Array.isArray(contracts) && !contracts.length)
    throw new BadRequestError('Contracts not found');

  const totalPages = Math.ceil(count / limit);

  return {
    contracts,
    pagination: {
      count: contracts.length,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      page,
      limit,
      totalPages,
    },
  };
};
