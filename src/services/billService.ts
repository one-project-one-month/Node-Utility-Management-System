import moment from 'moment';
import { calculateTotalAmount } from '../common/utils/calculateTotalAmount';
import prisma from '../lib/prismaClient';
import {
  CreateBillType,
  GetBillQueryType,
  GetTenantBillParamType,
  UpdateBillType,
} from '../validations/billSchema';
import { BadRequestError } from '../common/errors';

export async function createBillService(data: CreateBillType) {
  const total_amount = calculateTotalAmount(data);
  return prisma.bill.create({ data: { ...data, total_amount: total_amount } });
}

export async function getAllBillsService(query: GetBillQueryType) {
  const monthName = query.month;
  const year = Number(query.year);
  const startDate = moment(`${monthName} ${year}`, 'MMM YYYY')
    .startOf('month')
    .toDate();
  const endDate = moment(`${monthName} ${year}`, 'MMM YYYY')
    .endOf('month')
    .toDate();

  let isQuery;
  isQuery =
    query.month || query.year
      ? await prisma.bill.findMany({
          where: { created_at: { gte: startDate, lt: endDate } },
        })
      : await prisma.bill.findMany({ orderBy: { created_at: 'asc' } });

  return isQuery;
}

export async function updateBillService(
  bill_id: string,
  data: Partial<UpdateBillType>
) {
  const existingBill = await prisma.bill.findUnique({
    where: { id: bill_id },
  });
  const total_amount = calculateTotalAmount(data);

  if (!existingBill) {
    throw new BadRequestError('Bill row does not exit.');
  }
  return await prisma.bill.update({
    where: { id: bill_id },
    data: { ...data, total_amount },
  });
}

export async function getBillService(bill_id: string) {
  return await prisma.bill.findUnique({
    where: { id: bill_id },
  });
}

export async function getTenantBillLatestService(
  params: GetTenantBillParamType
) {
  const tenant_id = params.tenant_id;
  console.log('tenant_id', tenant_id);
  const tenant = await prisma.tenant.findUnique({ where: { id: tenant_id } });

  if (!tenant) {
    throw new BadRequestError('Tenant row does not exit.');
  }
  if (tenant) {
    return prisma.bill.findFirst({
      where: { room_id: tenant.room_id },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}

export async function getTenantBillHistoryService(
  params: GetTenantBillParamType
) {
  const tenant_id = params.tenant_id;
  const tenant = await prisma.tenant.findUnique({ where: { id: tenant_id } });

  if (!tenant) {
    throw new BadRequestError('Tenant row does not exit.');
  }
  if (tenant) {
    return prisma.bill.findMany({
      where: { room_id: tenant.room_id },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
