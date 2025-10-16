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
    room_id,
    rental_fee,
    electricity_fee,
    water_fee,
    fine_fee,
    service_fee,
    ground_fee,
    car_parking_fee,
    wifi_fee,
    due_date,
    created_date,
  } = data;

  // check if room exists
  const room = await prisma.room.findUnique({
    where: { id: room_id },
    select: { id: true },
  });
  if (!room) {
    throw new NotFoundError('Room not found');
  }

  // calculate total amount
  const totalAmount =
    rental_fee +
    electricity_fee +
    water_fee +
    (fine_fee || 0) +
    (service_fee || 0) +
    ground_fee +
    (car_parking_fee || 0) +
    (wifi_fee || 0);

  // calculate units
  const electricityUnit = electricity_fee / ELECTRICITY_RATE;
  const waterUnit = water_fee / WATER_RATE;

  const result = await prisma.$transaction(async (tx) => {
    // Create Bill
    const bill = await tx.bill.create({
      data: {
        room_id: String(room_id),
        rental_fee: rental_fee,
        electricity_fee: electricity_fee,
        water_fee: water_fee,
        fine_fee: fine_fee,
        service_fee: service_fee,
        ground_fee: ground_fee,
        car_parking_fee: car_parking_fee,
        wifi_fee: wifi_fee,
        total_amount: totalAmount,
        due_date: new Date(due_date),
        created_at: new Date(created_date),
      },
    });

    // create TotalUnits
    await tx.totalUnits.create({
      data: {
        bill_id: String(bill.id),
        electricity_units: electricityUnit,
        water_units: waterUnit,
        created_at: new Date(created_date),
      },
    });

    // create Invoice
    await tx.invoice.create({
      data: {
        bill_id: String(bill.id),
        status: 'Pending',
        invoice_no: `INV-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
        receipt: {
          create: {
            payment_method: 'Cash',
            paid_date: null,
          },
        },
      },
    });

    return bill;
  });

  return result;
};

export const updateBillsService = async (
  billId: string,
  data: UpdateBillSchemaType
) => {
  const {
    room_id,
    rental_fee,
    electricity_fee,
    water_fee,
    fine_fee,
    service_fee,
    ground_fee,
    car_parking_fee,
    wifi_fee,
    due_date,
    created_date,
  } = data;

  // check if bill exists
  const existingBill = await prisma.bill.findUnique({
    where: { id: billId },
  });
  if (!existingBill) throw new NotFoundError('Bill not found');

  const toNumber = (value: any) => (value ? Number(value) : 0);

  // recalculate total amount
  const totalAmount =
    toNumber(rental_fee ?? existingBill.rental_fee) +
    toNumber(electricity_fee ?? existingBill.electricity_fee) +
    toNumber(water_fee ?? existingBill.water_fee) +
    toNumber(fine_fee ?? existingBill.fine_fee) +
    toNumber(service_fee ?? existingBill.service_fee) +
    toNumber(ground_fee ?? existingBill.ground_fee) +
    toNumber(car_parking_fee ?? existingBill.car_parking_fee) +
    toNumber(wifi_fee ?? existingBill.wifi_fee);

  const electricityUnit =
    toNumber(electricity_fee ?? existingBill.electricity_fee) /
    ELECTRICITY_RATE;
  const waterUnit = toNumber(water_fee ?? existingBill.water_fee) / WATER_RATE;

  const updatedBill = await prisma.$transaction(async (tx) => {
    // update bill
    const bill = await tx.bill.update({
      where: { id: billId },
      data: {
        room_id: room_id ?? existingBill.room_id,
        rental_fee: rental_fee ?? existingBill.rental_fee,
        electricity_fee: electricity_fee ?? existingBill.electricity_fee,
        water_fee: water_fee ?? existingBill.water_fee,
        fine_fee: fine_fee ?? existingBill.fine_fee,
        service_fee: service_fee ?? existingBill.service_fee,
        ground_fee: ground_fee ?? existingBill.ground_fee,
        car_parking_fee: car_parking_fee ?? existingBill.car_parking_fee,
        wifi_fee: wifi_fee ?? existingBill.wifi_fee,
        total_amount: totalAmount,
        due_date: due_date ? new Date(due_date) : existingBill.due_date,
        created_at: created_date
          ? new Date(created_date)
          : existingBill.created_at,
      },
    });

    // update TotalUnits
    await tx.totalUnits.updateMany({
      where: { bill_id: billId },
      data: {
        electricity_units: electricityUnit,
        water_units: waterUnit,
        created_at: created_date
          ? new Date(created_date)
          : existingBill.created_at,
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
      total_unit: true,
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
      orderBy: { created_at: 'desc' },
      include: {
        room: true,
        total_unit: true,
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
    select: { room_id: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  // Get the latest bill
  const latestBill = await prisma.bill.findFirst({
    where: { room_id: tenant.room_id },
    orderBy: { created_at: 'desc' },
    include: {
      total_unit: true,
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
    select: { room_id: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  const [bills, totalCount] = await prisma.$transaction([
    prisma.bill.findMany({
      where: { room_id: tenant.room_id },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        total_unit: true,
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
