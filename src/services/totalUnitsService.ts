import { Request } from 'express';
import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateTotalUnitsType,
  UpdateTotalUnitsType,
} from '../validations/totalUnitsSchema';
import { generatePaginationData } from '../common/utils/paginationHelper';
import {
  TOTAL_UNIT_FLATTENER_CONFIG,
  universalFlattener,
} from '../common/utils/obj-flattener';

// Get All Total Units
export async function getAllTotalUnitsService(req: Request) {
  const { page, limit } = req.validatedQuery as PaginationQueryType;
  const skip = (page - 1) * limit;

  // Get totalUnits & totalCount
  const [totalUnits, totalCount] = await prisma.$transaction([
    prisma.totalUnits.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        electricityUnits: true,
        waterUnits: true,
        createdAt: true,
        updatedAt: true,
        billId: true,
        bill: {
          select: {
            id: true,
            room: {
              select: {
                id: true,
                roomNo: true,
                floor: true,
                status: true,
                tenant: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.totalUnits.count(),
  ]);

  if (!totalUnits || totalUnits.length === 0)
    throw new NotFoundError('No total units found');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);
  const flattenedUnits = universalFlattener(
    totalUnits,
    TOTAL_UNIT_FLATTENER_CONFIG
  );

  return {
    data: flattenedUnits || totalUnits,
    ...paginationData,
  };
}

// Get Single Total Units By Id
export async function getTotalUnitsByIdService(totalUnitId: string) {
  return await prisma.totalUnits.findUnique({
    where: { id: totalUnitId },
    select: {
      id: true,
      electricityUnits: true,
      waterUnits: true,
      createdAt: true,
      updatedAt: true,
      billId: true,
      bill: {
        select: {
          id: true,
          room: {
            select: {
              id: true,
              roomNo: true,
              floor: true,
              status: true,
              tenant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

// Get Single Total Units By Bill Id
export async function getTotalUnitsByBillIdService(billId: string) {
  return await prisma.totalUnits.findUnique({
    where: { billId: billId },
    select: {
      id: true,
      electricityUnits: true,
      waterUnits: true,
      createdAt: true,
      updatedAt: true,
      billId: true,
      bill: {
        select: {
          id: true,
          room: {
            select: {
              id: true,
              roomNo: true,
              floor: true,
              status: true,
              tenant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function createTotalUnitService({
  electricityUnits,
  waterUnits,
  billId,
}: CreateTotalUnitsType) {
  // Check if bill exists
  const existingBill = await prisma.bill.findUnique({
    where: { id: billId },
    select: { id: true },
  });
  if (!existingBill) throw new NotFoundError('Bill not found');

  // Check if total-units already exists for this bill
  const existingTotalUnits = await prisma.totalUnits.findUnique({
    where: { billId },
    select: { id: true },
  });

  if (existingTotalUnits)
    throw new BadRequestError('Total-units already exists for this bill');

  // Create new total-units
  return await prisma.totalUnits.create({
    data: {
      billId,
      electricityUnits,
      waterUnits,
    },
  });
}

export async function updateTotalUnitsService(
  totalUnitsId: string,
  { electricityUnits, waterUnits, billId }: UpdateTotalUnitsType
) {
  // Find if total-units exists
  const existingTotalUnits = await prisma.totalUnits.findUnique({
    where: { id: totalUnitsId },
    select: {
      id: true,
      electricityUnits: true,
      waterUnits: true,
      billId: true,
    },
  });

  if (!existingTotalUnits) throw new NotFoundError('Total-units not found');

  if (existingTotalUnits.billId !== billId || !billId)
    throw new BadRequestError('Bill id is not matched');

  return await prisma.totalUnits.update({
    where: { id: totalUnitsId },
    data: {
      electricityUnits,
      waterUnits,
    },
  });
}
