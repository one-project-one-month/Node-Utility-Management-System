import { Request } from 'express';
import prisma from '../lib/prismaClient';
import moment from 'moment';
import { NotFoundError } from '../common/errors';
import { Bill } from '../../generated/prisma';
import { GetTotalRevenueByMonthType } from '../validations/newBillsSchema';

export const getBillStatusAnalyticsService = async (req: Request) => {
  const { month, year } = req.validatedQuery as GetTotalRevenueByMonthType;
  const targetMonth = month ?? new Date().getMonth() + 1; // current Month;
  const targetYear = year ?? new Date().getFullYear();
  const bills = await prisma.bill.findMany({
    where: {
      createdAt: {
        gte: new Date(targetYear, targetMonth - 1, 1),
        lt: new Date(targetYear, targetMonth, 1),
      },
    },
    include: {
      invoice: {
        select: {
          status: true,
        },
      },
    },
  });
  const paidbills = bills.filter((bill: any) => bill.invoice.status === 'Paid');
  //   console.log('Paid bills', paidbills.length);
  const pendingbills = bills.filter(
    (bill: any) => bill.invoice.status === 'Pending'
  );
  //   console.log('Pending bills', pendingbills.length);
  const overduebills = bills.filter(
    (bill: any) => bill.invoice.status === 'Overdue'
  );
  // console.log('Overdue bills', overduebills.length);
  if (!bills) {
    throw new NotFoundError('No bills found for the current month');
  }

  const totalPaid = paidbills.reduce(
    (acc: number, bills: Bill) => acc + Number(bills.totalAmount),
    0
  );
  const totalPending = pendingbills.reduce(
    (acc: number, bills: Bill) => acc + Number(bills.totalAmount),
    0
  );
  const totalOverdue = overduebills.reduce(
    (acc: number, bills: Bill) => acc + Number(bills.totalAmount),
    0
  );
  return {
    month: `${year}-${month}`,
    pending: totalPending,
    paid: totalPaid,
    overdue: totalOverdue,
  };
};

// Service to get total bill revenue by month
export const getBillRevenueByFourMonthService = async (req: Request) => {
  const { month, year } = req.validatedQuery as GetTotalRevenueByMonthType;
  const monthNum = month ?? new Date().getMonth() + 1; // 1–12
  const yearNum = year ?? new Date().getFullYear();

  // Date for current month
  const thisMonthStart = new Date(yearNum, monthNum - 4, 1);
  const thisMonthEnd = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

  const bills = await prisma.bill.findMany({
    where: {
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  if (!bills) {
    throw new NotFoundError('No bills found for the current month');
  }

  const groupedBills = bills.reduce((acc: any, bill: Bill) => {
    const billMonth = moment(bill.createdAt).format('YYYY-MM');
    if (!acc[billMonth]) {
      acc[billMonth] = 0;
    }
    acc[billMonth] += Number(bill.totalAmount);
    return acc;
  }, {});

  return groupedBills;
};

// Contract analytics
export const contractTypeAnalyticsService = async () => {
  const contractTypes = await prisma.contractType.findMany({
    select: {
      name: true,
      _count: {
        select: {
          contract: true,
        },
      },
    },
  });

  if (!contractTypes.length) throw new NotFoundError('No contract types found');

  const flatten = contractTypes.map((ct) => ({
    contractType: ct.name,
    tenantCount: ct._count.contract,
  }));

  return flatten;
};

// Room analytics
export const roomAnalyticsService = async () => {
  const roomData = await prisma.room.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  if (!roomData.length) throw new NotFoundError('No room data found');

  const flatten = roomData.map((rd) => ({
    status: rd.status,
    count: rd._count.status,
  }));

  return flatten;
};
