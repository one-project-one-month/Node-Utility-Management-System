import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateContractTypeSchemaType,
  UpdateContractTypeSchemaType,
} from '../validations/contractTypeSchema';

// @desc create new contract type
export const createContractTypeService = async (
  data: CreateContractTypeSchemaType
) => {
  const exists = await prisma.contractType.findFirst({
    where: { name: data.name },
    select: { id: true },
  });
  if (exists?.id) throw new BadRequestError('Contract type already exists');

  return await prisma.contractType.create({ data });
};

// @desc get all contract types
export const getAllContractTypeService = async () => {
  const contractTypes = await prisma.contractType.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (Array.isArray(contractTypes) && !contractTypes.length)
    throw new NotFoundError('Contract types not found');

  return contractTypes;
};

// @desc get contract type by id
export const getByIdContractTypeService = async (contractTypeId: string) => {
  const contractType = await prisma.contractType.findUnique({
    where: { id: contractTypeId },
  });
  if (!contractType) throw new NotFoundError('Contract type not found');
  return contractType;
};

// @desc update contract type
export const updateContractTypeService = async (
  contractTypeId: string,
  data: UpdateContractTypeSchemaType
) => {
  const contractType = await prisma.contractType.findUnique({
    where: { id: contractTypeId },
  });
  if (!contractType) throw new NotFoundError('Contract type not found');

  return await prisma.contractType.update({
    where: { id: contractTypeId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.duration && { duration: data.duration }),
      ...(data.price && { price: data.price }),
      ...(data.facilities && { facilities: { set: data.facilities } }),
    },
  });
};
