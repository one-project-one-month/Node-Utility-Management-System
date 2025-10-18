import { Request } from 'express';
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

export async function createInvoiceService(body: CreateInvoiceType) {
  const existingBill = await prisma.bill.findUnique({
    where: { id: body.billId },
  });

  if (!existingBill) {
    throw new NotFoundError('Bill does not exist.');
  }

  const checkInvoice = await prisma.invoice.findFirst({
    where: { billId: body.billId },
  });

  if (checkInvoice) {
    throw new NotFoundError('Invoice for this Bill already exists.');
  }

  return await prisma.invoice.create({
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
  });
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
          createdAt: { gte: startDate, lt: endDate },
        }
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

export async function updateInvoiceService(
  param: GetInvoiceParamType,
  body: UpdateInvoiceType
) {
  const existingInvice = await prisma.invoice.findUnique({
    where: { id: param.invoiceId },
  });

  if (existingInvice?.billId !== body.billId) {
    throw new NotFoundError(
      "Bill ID does not match with the existing invoice's bill ID."
    );
  }

  if (body.status === 'Paid') {
    throw new BadRequestError(
      'Cannot update invoice to Paid status; it is set automatically upon receipt payment.'
    );
  }

  if (body.status === 'Overdue' || body.status === 'Pending') {
    return await prisma.invoice.update({
      where: { id: param.invoiceId },
      data: {
        status: body.status,
        billId: body.billId,
      },
    });
  }
}

export async function getInvoiceService(param: GetInvoiceParamType) {
  const existingInvice = await prisma.invoice.findUnique({
    where: { id: param.invoiceId },
  });

  if (!existingInvice) {
    throw new NotFoundError('Invoice ID does not exist.');
  }
  return await prisma.invoice.findFirst({
    where: { id: param.invoiceId },
    select: {
      id: true,
      status: true,
      billId: true,
      invoiceNo: true,
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
) {
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
      ? { ...whereClause, createdAt: { gte: startDate, lt: endDate } }
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
