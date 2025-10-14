import { Request } from 'express';
import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateTotalUnitsType,
  UpdateTotalUnitsType,
} from '../validations/totalUnitsSchema';
import { generatePaginationData } from '../common/utils/pagination-helper';

// Get All Total Units
export async function getAllTotalUnitsService(
  query: PaginationQueryType,
  req: Request
) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Get totalUnits & totalCount
  const [totalUnits, totalCount] = await Promise.all([
    prisma.totalUnits.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select:{
        id: true,
        electricity_units: true,
        water_units: true,
        created_at: true,
        updated_at: true,
        bill:{
          select: {
            room: {
              select:{
                room_no: true,
                floor: true,
                status: true,
              }
            }
          }
      }}
    }),
    prisma.totalUnits.count(),
  ]);

  if (totalUnits.length === 0) {
    throw new NotFoundError('No total units found');
  }

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    totalUnits,
    ...paginationData,
  };
}

// Get Single Total Units By Id
export async function getTotalUnitsByIdService(totalUnitId: string) {
  return await prisma.totalUnits.findUnique({
    where: { id: totalUnitId },
  });
}

// Get Single Total Units By Bill Id
export async function getTotalUnitsByBillIdService(billId: string) {
  return await prisma.totalUnits.findUnique({
    where: { bill_id: billId },
  });
}

export async function createTotalUnitService({
  electricity_units,
  water_units,
  bill_id,
}: CreateTotalUnitsType) {
  // Check if bill exists
  const existingBill = await prisma.bill.findUnique({
    where: { id: bill_id },
    select: { id: true },
  });
  if (!existingBill) throw new NotFoundError('Bill not found');

  // Check if total-units already exists for this bill
  const existingTotalUnits = await prisma.totalUnits.findUnique({
    where: { bill_id: bill_id },
    select: { id: true },
  });

  if (existingTotalUnits)
    throw new BadRequestError('Total-units already exists for this bill');

  // Create new total-units
  return await prisma.totalUnits.create({
    data: {
      bill_id,
      electricity_units,
      water_units,
    },
  });
}

export async function updateTotalUnitsService(
  totalUnitsId: string,
  { electricity_units, water_units, bill_id }: UpdateTotalUnitsType
) {
  // Find if total-units exists
  const existingTotalUnits = await prisma.totalUnits.findUnique({
    where: { id: totalUnitsId },
    select: {
      id: true,
      electricity_units: true,
      water_units: true,
      bill_id: true,
    },
  });

  if (!existingTotalUnits) throw new NotFoundError('Total-units not found');

  if (existingTotalUnits.bill_id !== bill_id || !bill_id)
    throw new BadRequestError('Bill id is not matched');

  return await prisma.totalUnits.update({
    where: { id: totalUnitsId },
    data: {
      electricity_units,
      water_units,
    },
  });
}
