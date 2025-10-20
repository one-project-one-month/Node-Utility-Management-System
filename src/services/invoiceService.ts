import { Request } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prismaClient';
import { Prisma } from '../../generated/prisma';
import {
  CreateInvoiceType,
  GetInvoiceParamType,
  GetInvoiceQueryType,
  GetTenantInvoiceParamType,
  UpdateInvoiceType,
} from '../validations/invoiceSchema';
import { BadRequestError, NotFoundError } from '../common/errors';
import getTimeLimitQuery from '../common/utils/timeLimitQuery';
import { generatePaginationData } from '../common/utils/paginationHelper';
import { PrismaClient, InvoiceStatus } from '../../generated/prisma';

export async function createInvoiceService(body: CreateInvoiceType) {
  //Check if Bill exists
  const existingBill = await prisma.bill.findUnique({
    where: { id: body.billId },
  });

  if (!existingBill) {
    throw new NotFoundError('Bill does not exist.');
  }

  //Prevent duplicate invoice for the same bill
  const checkInvoice = await prisma.invoice.findFirst({
    where: { billId: body.billId },
  });

  if (checkInvoice) {
    throw new NotFoundError('Invoice for this Bill already exists.');
  }

  //Create invoice and linked receipt
  const invoice =  await prisma.invoice.create({
    data: {
      status: body.status,
      billId: body.billId,
      invoiceNo: 'INV-' + crypto.randomUUID().split('-')[0].toUpperCase(),
      receipt: {
        create: {
          paymentMethod: 'Cash',
          paidDate: null,
        },
      },
    },
    include: { receipt: true },
  });

  return invoice;
}

export async function getAllInvoicesService(
  query: GetInvoiceQueryType,
  req: Request
) {
  const { startDate, endDate } = getTimeLimitQuery(query);
  const whereClause: Prisma.InvoiceWhereInput = {
    status: query.status,
  };
  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // The final where clause based on date filters
  const finalWhereClause: Prisma.InvoiceWhereInput =
    query.month || query.year
      ? {
          ...whereClause,
          createdAt: { gt: startDate, lte: endDate },
        }
      : whereClause;

  // Get users and totalCount with pagination
  const [invoices, totalCount] = await prisma.$transaction([
    prisma.invoice.findMany({
      where: finalWhereClause,
      select: {
        id: true,
        status: true,
        // receiptSent: true,
        billId: true,
        invoiceNo: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.count({
      where: finalWhereClause,
    }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: invoices,
    ...paginationData,
  };
}

export async function updateInvoiceService(
  param: GetInvoiceParamType,
  body: UpdateInvoiceType
) {
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: param.invoiceId },
    include: { receipt: true, bill: true}, //include Bill for dueDate checking
  });

  if (existingInvoice?.billId !== body.billId) {
  if (existingInvoice?.billId !== body.billId) {
    throw new NotFoundError(
      "Bill ID does not match with the existing invoice's bill ID."
    );
  }

  if (!existingInvoice) {
      throw new NotFoundError('Invoice not found.');
  }

  if (body.status === 'Paid') {
    throw new BadRequestError(
      'Cannot manually set status to PAID; it updates automatically when receipt is paid.'
    );
  }

  let newStatus: InvoiceStatus = InvoiceStatus.Pending;
  const now = new Date();

  if (existingInvoice.receipt?.paidDate) {
    newStatus = InvoiceStatus.Paid
  } else if (existingInvoice.bill?.dueDate && now > existingInvoice.bill.dueDate) {
    newStatus = InvoiceStatus.Overdue;
  }
  
  //Update invoice fields
  const updatedInvoice = await prisma.invoice.update({
    where: { id: param.invoiceId },
    data: {
      status: newStatus,
    },
    include: { receipt: true, bill: true },
  });

  return updatedInvoice;
}

export async function getInvoiceService(param: GetInvoiceParamType) {
  const existingInvoice= await prisma.invoice.findUnique({
    where: { id: param.invoiceId },
  });

  if (!existingInvoice){
    throw new NotFoundError('Invoice ID does not exist.');
  }
  return await prisma.invoice.findFirst({
    where: { id: param.invoiceId },
    select: {
      id: true,
      status: true,
      billId: true,
      invoiceNo: true,
      // receiptSent: true,
      createdAt: true,
      updatedAt: true,
      receipt: {
        select: {
          paymentMethod: true,
          paidDate: true,
        },
      },
    },
  });
}

export async function getTenantInvoiceLatestService(
  param: GetTenantInvoiceParamType
) {
  const tenantId = param.tenantId;
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) throw new NotFoundError('Tenant not found.');

  return await prisma.invoice.findFirst({
    where: {
      bill: {
        room: {
          tenant: {
            id: tenantId,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getTenantInvoiceHistoryService(
  param: GetTenantInvoiceParamType,
  query: GetInvoiceQueryType,
  req: Request
) 
{
  const { startDate, endDate } = getTimeLimitQuery(query);
  const whereClause: Prisma.InvoiceWhereInput = {
    bill: {
      room: {
        tenant: {
          id: param.tenantId,
        },
      },
    },
    status: query.status,
  };

  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const finalWhereClause: Prisma.InvoiceWhereInput =
    query.month || query.year
      ? { ...whereClause, createdAt: { gt: startDate, lte: endDate } }
      : whereClause;

  // Get users and totalCount with pagination
  const [invoices, totalCount] = await prisma.$transaction([
    prisma.invoice.findMany({
      where: finalWhereClause,
      select: {
        id: true,
        status: true,
        billId: true,
        invoiceNo: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.count({
      where: finalWhereClause,
    }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: invoices,
    ...paginationData,
  };
}
}
