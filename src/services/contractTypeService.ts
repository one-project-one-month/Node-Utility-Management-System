import { BadRequestError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateContractTypeSchemaType,
  GetAllContractTypesQuerySchemaType,
  UpdateContractTypeSchemaType,
} from '../validations/contractTypeSchema';

// @desc create new contract type
export const createContractTypeService = async (
  data: CreateContractTypeSchemaType
) => {
  const exists = await prisma.contractType.findFirst({
    where: { name: data.name },
  });
  if (exists) throw new BadRequestError('Contract type already exists');

  return await prisma.contractType.create({ data });
};

// @desc get all contract types
export const getAllContractTypeService = async (
  data: GetAllContractTypesQuerySchemaType
) => {
  const { page, limit } = data;
  const skip = (page - 1) * limit;

  const [contractType, count] = await Promise.all([
    prisma.contractType.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.contractType.count(),
  ]);

  if (Array.isArray(contractType) && contractType.length === 0)
    throw new BadRequestError('No contract types found');

  const totalPages = Math.ceil(count / limit);
  return {
    contractType,
    pagination: {
      count: contractType.length,
      prevPage: page > 1,
      nextPage: page < totalPages,
      page,
      limit,
      totalPages,
    },
  };
};

// @desc get contract type by id
export const getByIdContractTypeService = async (contractTypeId: string) => {
  const contractType = await prisma.contractType.findUnique({
    where: { id: contractTypeId },
  });
  if (!contractType) throw new BadRequestError('Contract type not found');
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
  if (!contractType) throw new BadRequestError('Contract type not found');

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
