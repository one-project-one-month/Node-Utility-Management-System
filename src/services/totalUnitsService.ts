import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateTotalUnitsType,
  UpdateTotalUnitsType,
} from '../validations/totalUnitsSchema';

export async function getAllTotalUnitsService() {
  // add further queries
  const whereClause: any = {};

  return await prisma.totalUnits.findMany({
    where: whereClause,
  });
}

// Get by id
export async function getTotalUnitsByIdService(totalUnitId: string) {
  return await prisma.totalUnits.findUnique({
    where: { id: totalUnitId },
  });
}

// Get by bill id
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
  { electricity_units, water_units }: Partial<UpdateTotalUnitsType>
) {
  // Find if total-units exists
  const existingTotalUnits = await prisma.totalUnits.findUnique({
    where: { id: totalUnitsId },
    select: {
      id: true,
      electricity_units: true,
      water_units: true,
    },
  });
  if (!existingTotalUnits) throw new NotFoundError('Total-units not found');

  return await prisma.totalUnits.update({
    where: { id: totalUnitsId },
    data: {
      electricity_units,
      water_units,
    },
  });
}
