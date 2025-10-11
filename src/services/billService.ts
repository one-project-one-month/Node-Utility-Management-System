import { genetatedRentalFee } from './../common/utils/generatedRentalFee';
import { ContractType } from './../../generated/prisma/index.d';
import prisma from '../lib/prismaClient';
import {
  CreateBillType,
  GetBillParamType,
  GetBillQueryType,
  GetTanentBillParamType,
  UpdateBillType,
} from '../validations/billSchema';
import { calculateTotalAmount } from '../common/utils/calculateTotalAmount';
import { BadRequestError } from '../common/errors';
import getTimeLimitQuery from '../common/utils/timeLimitQuery';
import moment from 'moment';

export async function createBillService(data: CreateBillType) {
  const { generatedRentalFee, generatedData } = await genetatedRentalFee(data);
  const total_amount = calculateTotalAmount(generatedData);
  return prisma.bill.create({
    data: {
      ...generatedData,
      rental_fee: generatedRentalFee ? generatedRentalFee : data.rental_fee,
      total_amount: total_amount,
    },
  });
}

export async function getAllBillsService(query: GetBillQueryType) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = page * limit;

  const { startDate, endDate } = getTimeLimitQuery(query);

  const totalCount =
    query.month && query.year
      ? await prisma.bill.count({
          where: { created_at: { gte: startDate, lt: endDate } },
        })
      : await prisma.bill.count();
  const totalPages = Math.ceil(totalCount / limit);

  let bills;
  bills =
    query.month && query.year
      ? await prisma.bill.findMany({
          where: { created_at: { gte: startDate, lt: endDate } },
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        })
      : await prisma.bill.findMany({
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        });
  console.log(bills);
  const pagination = {
    count: bills.length,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalPages,
    totalCount,
  };
  return {
    bills,
    pagination,
  };
}

export async function updateBillService(billId: string, data: UpdateBillType) {
  const existingBill = await prisma.bill.findUnique({
    where: { id: billId },
  });
  const total_amount = calculateTotalAmount(data);

  if (!existingBill) {
    throw new BadRequestError('Bill row does not exit.');
  }

  console.log(existingBill.room_id, data.room_id);
  if (existingBill.room_id !== data.room_id) {
    throw new BadRequestError('Room ID cannot be changed.');
  }
  return await prisma.bill.update({
    where: { id: billId },
    data: {
      room_id: existingBill.room_id,
      rental_fee: data.rental_fee ?? data.rental_fee,
      electricity_fee: data.electricity_fee ?? data.electricity_fee,
      water_fee: data.water_fee ?? data.water_fee,
      service_fee: data.service_fee ?? data.service_fee,
      ground_fee: data.ground_fee ?? data.ground_fee,
      car_parking_fee: data.car_parking_fee ?? data.car_parking_fee,
      wifi_fee: data.wifi_fee ?? data.wifi_fee,
      fine_fee: data.fine_fee ?? data.fine_fee,
      total_amount: total_amount ?? total_amount,
      due_date: data.due_date ?? data.due_date,
    },
  });
}

export async function getBillService(param: GetBillParamType) {
  return await prisma.bill.findUnique({
    where: { id: param.billId },
  });
}

export async function getTanentBillLatestService(
  params: GetTanentBillParamType
) {
  const tenantId = params.tenantId;
  const tanent = await prisma.tenant.findUnique({ where: { id: tenantId } });

  if (!tanent) {
    throw new BadRequestError('Tanent row does not exit.');
  }
  if (tanent) {
    return prisma.bill.findFirst({
      where: { room_id: tanent.room_id },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}

export async function getTanentBillHistoryService(
  params: GetTanentBillParamType,
  query: GetBillQueryType
) {
  const tenantId = params.tenantId;
  const page = query.page;
  const limit = query.limit;
  const skip = page * limit;
  const { startDate, endDate } = getTimeLimitQuery(query);
  const tanent = await prisma.tenant.findUnique({ where: { id: tenantId } });

  if (!tanent) {
    throw new BadRequestError('Tanent row does not exit.');
  }

  const totalCount =
    query.month && query.year
      ? await prisma.bill.count({
          where: {
            room: { tenant: { id: tenantId } },
            created_at: { gte: startDate, lt: endDate },
          },
        })
      : await prisma.bill.count({
          where: { room: { tenant: { id: tenantId } } },
        });

  const totalPages = Math.ceil(totalCount / limit);
  let bills;
  console.log(startDate, endDate);
  bills =
    query.month && query.year
      ? await prisma.bill.findMany({
          where: {
            room: { tenant: { id: tenantId } },
            due_date: { gte: new Date() },
          },
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        })
      : await prisma.bill.findMany({
          where: { room: { tenant: { id: tenantId } } },
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        });

  const pagination = {
    count: bills.length,
    hasPrevPage: page > 0,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalPages,
    totalCount,
  };

  return {
    bills,
    pagination,
  };
}
