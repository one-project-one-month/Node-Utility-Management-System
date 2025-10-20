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

// Utility: generate random number within range
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Utility: generate random date within ±15 days
const randomDate = () => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 30) - 15; // ±15 days
  return new Date(now.setDate(now.getDate() + randomDays));
};

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

  // Generate random data if missing
  const randomRental = rentalFee ?? randomNumber(100000, 300000);
  const randomElectricity = electricityFee ?? randomNumber(5000, 30000);
  const randomWater = waterFee ?? randomNumber(3000, 15000);
  const randomFine = fineFee ?? randomNumber(0, 2000);
  const randomService = serviceFee ?? randomNumber(1000, 5000);
  const randomGround = groundFee ?? randomNumber(500, 1500);
  const randomParking = carParkingFee ?? randomNumber(1000, 4000);
  const randomWifi = wifiFee ?? randomNumber(1000, 3000);

  const totalAmount =
    (rentalFee || 0) +
    (electricityFee || 0) +
    (waterFee || 0) +
    (fineFee || 0) +
    (serviceFee || 0) +
    (groundFee || 0) +
    (carParkingFee || 0) +
    (wifiFee || 0);

  const electricityUnit = (randomElectricity / ELECTRICITY_RATE).toFixed(2);
  const waterUnit = (randomWater / WATER_RATE).toFixed(2);

  const bill = await prisma.bill.create({
    data: {
      roomId,
      rentalFee: randomRental,
      electricityFee: randomElectricity,
      waterFee: randomWater,
      fineFee: randomFine,
      serviceFee: randomService,
      groundFee: randomGround,
      carParkingFee: randomParking,
      wifiFee: randomWifi,
      totalAmount,
      dueDate: new Date(dueDate ?? randomDate()),
      createdAt: new Date(createdAt ?? randomDate()),
    },
  });

  await prisma.totalUnits.create({
    data: {
      bill: { connect: { id: bill.id } },
      electricityUnits: Number(electricityUnit),
      waterUnits: Number(waterUnit),
      createdAt: new Date(createdAt ?? randomDate()),
    },
  });

  await prisma.invoice.create({
    data: {
      bill: { connect: { id: bill.id } },
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

  // Utility fallback to existing or new value
  const valueOrExisting = (newVal: number | undefined, oldVal: number) =>
    newVal !== undefined ? newVal : oldVal;

  // Recalculate all amounts safely
  const newRental = valueOrExisting(
    rentalFee,
    toNumber(existingBill.rentalFee)
  );
  const newElectric = valueOrExisting(
    electricityFee,
    toNumber(existingBill.electricityFee)
  );
  const newWater = valueOrExisting(waterFee, toNumber(existingBill.waterFee));
  const newFine = valueOrExisting(fineFee, toNumber(existingBill.fineFee));
  const newService = valueOrExisting(
    serviceFee,
    toNumber(existingBill.serviceFee)
  );
  const newGround = valueOrExisting(
    groundFee,
    toNumber(existingBill.groundFee)
  );
  const newParking = valueOrExisting(
    carParkingFee,
    toNumber(existingBill.carParkingFee)
  );
  const newWifi = valueOrExisting(wifiFee, toNumber(existingBill.wifiFee));

  const totalAmount =
    newRental +
    newElectric +
    newWater +
    newFine +
    newService +
    newGround +
    newParking +
    newWifi;

  const electricityUnit = Number((newElectric / ELECTRICITY_RATE).toFixed(2));
  const waterUnit = Number((newWater / WATER_RATE).toFixed(2));

  const updatedBill = await prisma.$transaction(async (tx) => {
    // update bill
    const bill = await tx.bill.update({
      where: { id: billId },
      data: {
        roomId: roomId ?? existingBill.roomId,
        rentalFee: newRental,
        electricityFee: newElectric,
        waterFee: newWater,
        fineFee: newFine,
        serviceFee: newService,
        groundFee: newGround,
        carParkingFee: newParking,
        wifiFee: newWifi,
        totalAmount,
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

  return { data: bills, ...paginationData };
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
