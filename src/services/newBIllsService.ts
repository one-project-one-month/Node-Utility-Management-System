import { NotFoundError } from '../common/errors';
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
    const invoiceNo = `INV-${Date.now()}-${bill.id.slice(0, 6)}`; // Generate a unique invoice number

    await tx.invoice.create({
      data: {
        bill_id: String(bill.id),
        invoice_no: invoiceNo,
        status: 'Pending',
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
    },
  });
  if (!bill) throw new NotFoundError('Bill not found');

  return bill;
};

export const getAllBillsService = async (query: PaginationQueryType) => {
  // pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const totalCount = await prisma.bill.count();
  const totalPages = Math.ceil(totalCount / limit);

  // get all bills
  const bills = await prisma.bill.findMany({
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
    include: {
      room: true,
    },
  });
  if (Array.isArray(bills) && !bills.length)
    throw new NotFoundError('Bills not found');

  const pagination = {
    count: bills.length,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalCount,
    totalPages,
  };
  return { bills, pagination };
};

// export const GetBillByTenentIdService = async (tenantId: string) => {
//   const bills = await prisma.bill.findMany({
//     where: { tenant_id: tenantId },
//   });
//   if (Array.isArray(bills) && !bills.length)
//     throw new NotFoundError('Bills not found');
//   return bills;
// };
