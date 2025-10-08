import prisma from '../lib/prismaClient';
import { Prisma } from '../../generated/prisma';
import {
  CreateInvoiceType,
  GetInvoiceParamType,
  GetInvoiceQueryType,
  GetTenantInvoiceParamType,
  UpdateInvoiceType,
} from '../validations/invoiceSchema';
import { NotFoundError } from '../common/errors';
import getTimeLimitQuery from '../common/utils/timeLimitQuery';

export async function createInvoiceService(body: CreateInvoiceType) {
  return await prisma.invoice.create({
    data: {
      status: body.status,
      bill_id: body.bill_id,
      receipt: {
        create: {
          payment_method: 'Cash',
          paid_date: null,
        },
      },
    },
  });
}

export async function getAllInvoicesService(query: GetInvoiceQueryType) {
  const { startDate, endDate } = getTimeLimitQuery(query);

  const whereClause: Prisma.InvoiceWhereInput = {
    status: query.status,
    created_at: {
      gte: startDate,
      lt: endDate,
    },
  };

  const selectedInvoice = {
    id: true,
    status: true,
    bill_id: true,
    created_at: true,
    updated_at: true,
  };

  // Calculate pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.invoice.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(totalCount / limit);

  // Get users with pagination
  let invoices;
  invoices = await prisma.invoice.findMany({
    where: whereClause,
    select: selectedInvoice,
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  if (query.month?.length) {
    invoices = await prisma.invoice.findMany({
      where: {
        status: query.status,
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: selectedInvoice,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    });
  }

  // Build pagination info
  const pagination = {
    count: invoices.length,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalPages,
    totalCount,
  };

  return {
    invoices,
    pagination,
  };
}

export async function updateInvoiceService(
  param: GetInvoiceParamType,
  body: UpdateInvoiceType
) {
  if (body.status === 'Paid') {
    return await prisma.invoice.update({
      where: { id: param.invoice_id },
      data: {
        ...body,
        receipt: { update: { paid_date: new Date(Date.now()) } },
      },
      select: {
        id: true,
        status: true,
        bill_id: true,
        created_at: true,
        updated_at: true,
        receipt: {
          select: {
            id: true,
            payment_method: true,
            paid_date: true,
          },
        },
      },
    });
  }
}

export async function getInvoiceService(param: GetInvoiceParamType) {
  return await prisma.invoice.findFirst({
    where: { id: param.invoice_id },
    select: {
      id: true,
      status: true,
      bill_id: true,
      created_at: true,
      updated_at: true,
      receipt: {
        select: {
          payment_method: true,
          paid_date: true,
        },
      },
    },
  });
}

export async function getTenantInvoiceLatestService(
  param: GetTenantInvoiceParamType
) {
  const tenant_id = param.tenant_id;
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenant_id },
  });

  if (tenant === null) throw new NotFoundError('Tenant Row is not found.');

  return await prisma.invoice.findFirst({
    where: {
      bill: {
        room: {
          tenant: {
            id: tenant_id,
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getTenantInvoiceHistoryService(
  param: GetTenantInvoiceParamType,
  query: GetInvoiceQueryType
) {
  const whereClause: Prisma.InvoiceWhereInput = {
    bill: {
      room: {
        tenant: {
          id: param.tenant_id,
        },
      },
    },
  };

  const selectedInvoice = {
    id: true,
    status: true,
    bill_id: true,
    created_at: true,
    updated_at: true,
  };

  // Calculate pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  let totalCount;
  totalCount = await prisma.invoice.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / limit);

  // Get users with pagination
  let invoices;

  invoices = await prisma.invoice.findMany({
    where: whereClause,
    select: selectedInvoice,
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
  });
  // Build pagination info
  const pagination = {
    count: invoices.length,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    page,
    limit,
    totalPages,
    totalCount,
  };

  return {
    data: invoices,
    pagination,
  };
}
