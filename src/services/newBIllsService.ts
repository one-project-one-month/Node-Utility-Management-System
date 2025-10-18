import { Request } from 'express';
import { NotFoundError } from '../common/errors';
import { generatePaginationData } from '../common/utils/paginationHelper';
import prisma from '../lib/prismaClient';
import {
  CreateBillSchemaType,
  UpdateBillSchemaType,
} from '../validations/newBillsSchema';
import { PaginationQueryType } from '../validations/paginationSchema';

// define rate constants (cost per unit)
const ELECTRICITY_RATE = 500;
const WATER_RATE = 300;

export const createBillService = async (data: CreateBillSchemaType) => {
  const {
    roomId,
    rentalFee,
    electricityFee,
    waterFee,
    fineFee,
    serviceFee,
    groundFee,
    carParkingFee,
    wifiFee,
    dueDate,
    createdAt,
  } = data;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });
  if (!room) throw new NotFoundError('Room not found');

  const totalAmount =
    rentalFee +
    electricityFee +
    waterFee +
    (fineFee || 0) +
    (serviceFee || 0) +
    groundFee +
    (carParkingFee || 0) +
    (wifiFee || 0);

  const electricityUnit = electricityFee / ELECTRICITY_RATE;
  const waterUnit = waterFee / WATER_RATE;

  const bill = await prisma.$transaction(async (tx) => {
    const bill = await tx.bill.create({
      data: {
        roomId,
        rentalFee,
        electricityFee,
        waterFee,
        fineFee,
        serviceFee,
        groundFee,
        carParkingFee,
        wifiFee,
        totalAmount,
        dueDate: new Date(dueDate),
        createdAt: new Date(createdAt),
      },
    });

    await tx.totalUnits.create({
      data: {
        billId: bill.id,
        electricityUnits: electricityUnit,
        waterUnits: waterUnit,
        createdAt: new Date(createdAt),
      },
    });

    await tx.invoice.create({
      data: {
        billId: bill.id,
        status: 'Pending',
        invoiceNo: `INV-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
        receipt: {
          create: {
            paymentMethod: 'Cash',
            paidDate: null,
          },
        },
      },
    });

    return bill;
  });

  return bill;
};

export const updateBillsService = async (
  billId: string,
  data: UpdateBillSchemaType
) => {
  const {
    roomId,
    rentalFee,
    electricityFee,
    waterFee,
    fineFee,
    serviceFee,
    groundFee,
    carParkingFee,
    wifiFee,
    dueDate,
    createdAt,
  } = data;

  // check if bill exists
  const existingBill = await prisma.bill.findUnique({
    where: { id: billId },
  });
  if (!existingBill) throw new NotFoundError('Bill not found');

  const toNumber = (value: any) => (value ? Number(value) : 0);

  // recalculate total amount
  const totalAmount =
    toNumber(rentalFee ?? existingBill.rentalFee) +
    toNumber(electricityFee ?? existingBill.electricityFee) +
    toNumber(waterFee ?? existingBill.waterFee) +
    toNumber(fineFee ?? existingBill.fineFee) +
    toNumber(serviceFee ?? existingBill.serviceFee) +
    toNumber(groundFee ?? existingBill.groundFee) +
    toNumber(carParkingFee ?? existingBill.carParkingFee) +
    toNumber(wifiFee ?? existingBill.wifiFee);

  const electricityUnit =
    toNumber(electricityFee ?? existingBill.electricityFee) / ELECTRICITY_RATE;
  const waterUnit = toNumber(waterFee ?? existingBill.waterFee) / WATER_RATE;

  const updatedBill = await prisma.$transaction(async (tx) => {
    // update bill
    const bill = await tx.bill.update({
      where: { id: billId },
      data: {
        roomId: roomId ?? existingBill.roomId,
        rentalFee: rentalFee ?? existingBill.rentalFee,
        electricityFee: electricityFee ?? existingBill.electricityFee,
        waterFee: waterFee ?? existingBill.waterFee,
        fineFee: fineFee ?? existingBill.fineFee,
        serviceFee: serviceFee ?? existingBill.serviceFee,
        groundFee: groundFee ?? existingBill.groundFee,
        carParkingFee: carParkingFee ?? existingBill.carParkingFee,
        wifiFee: wifiFee ?? existingBill.wifiFee,
        totalAmount: totalAmount,
        dueDate: dueDate ? new Date(dueDate) : existingBill.dueDate,
        createdAt: createdAt ? new Date(createdAt) : existingBill.createdAt,
      },
    });

    // update TotalUnits
    await tx.totalUnits.updateMany({
      where: { billId },
      data: {
        electricityUnits: electricityUnit,
        waterUnits: waterUnit,
        createdAt: createdAt ? new Date(createdAt) : existingBill.createdAt,
      },
    });

    return bill;
  });

  return updatedBill;
};

export const getBillsByIdService = async (billId: string) => {
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      room: true,
      totalUnit: true,
      invoice: {
        include: {
          receipt: true,
        },
      },
    },
  });
  if (!bill) throw new NotFoundError('Bill not found');

  return bill;
};

export const getAllBillsService = async (
  query: PaginationQueryType,
  req: Request
) => {
  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // get all bills and total count
  const [bills, totalCount] = await prisma.$transaction([
    prisma.bill.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        totalUnit: true,
        invoice: {
          include: {
            receipt: true,
          },
        },
      },
    }),
    prisma.bill.count(),
  ]);

  if (Array.isArray(bills) && !bills.length)
    throw new NotFoundError('Bills not found');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return { bills, ...paginationData };
};

export const getLatestBillByTenantIdService = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { roomId: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  // Get the latest bill
  const latestBill = await prisma.bill.findFirst({
    where: { roomId: tenant.roomId },
    orderBy: { createdAt: 'desc' },
    include: {
      totalUnit: true,
      invoice: {
        include: {
          receipt: true,
        },
      },
    },
  });

  if (!latestBill) throw new NotFoundError('No bills found for this tenant');
  return latestBill;
};

export const getBillHistoryByTenantIdService = async (
  tenantId: string,
  query: PaginationQueryType,
  req: Request
) => {
  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { roomId: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  const [bills, totalCount] = await prisma.$transaction([
    prisma.bill.findMany({
      where: { roomId: tenant.roomId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        totalUnit: true,
        invoice: {
          include: {
            receipt: true,
          },
        },
      },
    }),
    prisma.bill.count(),
  ]);

  if (!bills.length) throw new NotFoundError('No bills found for this tenant');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return { bills, ...paginationData };
};
