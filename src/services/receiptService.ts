import { Prisma } from '../../generated/prisma';
import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateReceiptType,
  GetAllReceiptsQueryType,
  UpdateReceiptType,
} from '../validations/receiptSchema';

export async function getAllReceiptsService(query: GetAllReceiptsQueryType) {
  const whereClause: Prisma.ReceiptWhereInput = {};

  // Add payment_method filter
  if (query.payment_method) {
    whereClause.payment_method = query.payment_method;
  }

  // Calculate pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.receipt.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / limit);

  // Get receipts with pagination and relations
  const receipts = await prisma.receipt.findMany({
    where: whereClause,
    // include: {
    //   invoice: {
    //     include: {
    //       bill: {
    //         include: {
    //           room: {
    //             include: {
    //               tenant: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  // Build pagination info
  const pagination = {
    count: receipts.length,
    prevPage: page > 1 ? page - 1 : false,
    nextPage: page < totalPages ? page + 1 : false,
    page,
    limit,
    totalPages,
    totalCount,
  };

  return {
    receipts,
    pagination,
  };
}

// Get by id
export async function getReceiptByIdService(receiptId: string) {
  return await prisma.receipt.findUnique({
    where: { id: receiptId },
  });
}

// Get by invoice id
export async function getReceiptByInvoiceIdService(invoiceId: string) {
  return await prisma.receipt.findUnique({
    where: { invoice_id: invoiceId },
  });
}

export async function createReceiptService(data: CreateReceiptType) {
  // Check if invoice exists
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: data.invoice_id },
    select: { id: true },
  });
  if (!existingInvoice) throw new NotFoundError('Invoice not found');

  // Check if receipt already exists for this invoice
  const existingReceipt = await prisma.receipt.findUnique({
    where: { invoice_id: data.invoice_id },
    select: { id: true },
  });

  if (existingReceipt)
    throw new BadRequestError('Receipt already exists for this invoice');

  // Create new receipt
  return await prisma.receipt.create({
    data: {
      invoice_id: data.invoice_id,
      payment_method: data.payment_method,
      paid_date: data.paid_date,
    },
  });
}

export async function updateReceiptService(
  receiptId: string,
  data: Partial<UpdateReceiptType>
) {
  // Find if receipt exists
  const existingReceipt = await prisma.receipt.findUnique({
    where: { id: receiptId },
    select: {
      id: true,
      invoice_id: true,
    },
  });

  if (!existingReceipt) throw new NotFoundError('Receipt not found');

  return await prisma.receipt.update({
    where: { id: receiptId },
    data,
  });
}

// Get latest receipt by tenant id (single most recent receipt)
export async function getLatestReceiptByTenantIdService(tenantId: string) {
  if (!tenantId) throw new NotFoundError('Tenant id not found');

  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });

  if (!tenant) throw new NotFoundError('Tenant not found');

  return await prisma.receipt.findFirst({
    where: {
      invoice: {
        bill: {
          room: {
            tenant: {
              id: tenantId,
            },
          },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

// Get receipt history by tenant id (all receipts)
export async function getReceiptHistoriesByTenantIdService(
  tenantId: string,
  query: PaginationQueryType
) {
  if (!tenantId) throw new NotFoundError('Tenant id not found');

  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });

  if (!tenant) throw new NotFoundError('Tenant not found');

  // Calculate pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Build where clause
  const whereClause: Prisma.ReceiptWhereInput = {
    invoice: {
      bill: {
        room: {
          tenant: {
            id: tenantId,
          },
        },
      },
    },
  };

  // Get total count for pagination
  const totalCount = await prisma.receipt.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / limit);

  // Get receipts with pagination
  const receiptHistories = await prisma.receipt.findMany({
    where: whereClause,
    // include: {
    //   invoice: {
    //     include: {
    //       bill: {
    //         include: {
    //           room: {
    //             include: {
    //               tenant: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  // Build pagination info
  const pagination = {
    count: receiptHistories.length,
    prevPage: page > 1 ? page - 1 : false,
    nextPage: page < totalPages ? page + 1 : false,
    page,
    limit,
    totalPages,
    totalCount,
  };

  return {
    receiptHistories,
    pagination,
  };
}
