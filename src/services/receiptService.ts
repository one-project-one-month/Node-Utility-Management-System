import { Request } from 'express';
import { Prisma } from '../../generated/prisma';
import { BadRequestError, NotFoundError } from '../common/errors';
import { generatePaginationData } from '../common/utils/pagination-helper';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateReceiptType,
  GetAllReceiptsQueryType,
  UpdateReceiptType,
} from '../validations/receiptSchema';

export async function getAllReceiptsService(
  query: GetAllReceiptsQueryType,
  req: Request
) {
  const whereClause: Prisma.ReceiptWhereInput = {};

  // Add payment_method filter
  if (query.payment_method) {
    whereClause.payment_method = query.payment_method;
  }

  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Get receipts and total count with pagination and relations
  const [receipts, totalCount] = await prisma.$transaction([
    prisma.receipt.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.receipt.count({ where: whereClause }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    receipts,
    ...paginationData,
  };
}

// Get by id
export async function getReceiptByIdService(receiptId: string) {
  return await prisma.receipt.findUnique({
    where: { id: receiptId },
    select: {
      id: true,
      payment_method: true,
      paid_date: true,
      created_at: true,
      updated_at: true,
      invoice: true,
    },
  });
}

// Get by invoice id
export async function getReceiptByInvoiceIdService(invoiceId: string) {
  return await prisma.receipt.findUnique({
    where: { invoice_id: invoiceId },
    select: {
      id: true,
      payment_method: true,
      paid_date: true,
      created_at: true,
      updated_at: true,
      invoice: true,
    },
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

  // Use <transaction> from prisma
  return await prisma.$transaction(async (tx) => {
    // Create receipt
    const receipt = await tx.receipt.create({
      data: {
        invoice_id: data.invoice_id,
        payment_method: data.payment_method,
        paid_date: data.paid_date,
      },
      select: {
        id: true,
        payment_method: true,
        paid_date: true,
        created_at: true,
        updated_at: true,
        invoice: true,
      },
    });

    // Update invoice's status
    await tx.invoice.update({
      where: { id: data.invoice_id },
      data: { status: 'Paid' },
    });

    return receipt;
  });
}

export async function updateReceiptService(
  receiptId: string,
  data: UpdateReceiptType
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

  // Find if invoice exists
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: existingReceipt.invoice_id },
  });
  if (!existingInvoice)
    throw new NotFoundError('Invoice with this receipt not found');

  // Use transaction to update both receipt and invoice status consistently
  return await prisma.$transaction(async (tx) => {
    // Update receipt
    const updatedReceipt = await tx.receipt.update({
      where: { id: receiptId },
      data: {
        payment_method: data.payment_method,
        paid_date: data.paid_date,
      },
      select: {
        id: true,
        invoice_id: true,
        payment_method: true,
        paid_date: true,
        created_at: true,
        updated_at: true,
        invoice: true,
      },
    });

    // Update invoice status
    const newInvoiceStatus = data.paid_date ? 'Paid' : 'Pending';
    await tx.invoice.update({
      where: { id: existingReceipt.invoice_id },
      data: { status: newInvoiceStatus },
    });

    return updatedReceipt;
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
  query: PaginationQueryType,
  req: Request
) {
  if (!tenantId) throw new NotFoundError('Tenant id not found');

  // Check if tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true },
  });

  if (!tenant) throw new NotFoundError('Tenant not found');

  // Calculate pagination
  const { page, limit } = query;
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

  // Get receipts and totalCount with pagination
  const [receiptHistories, totalCount] = await prisma.$transaction([
    prisma.receipt.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.receipt.count({ where: whereClause }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    receiptHistories,
    ...paginationData,
  };
}
