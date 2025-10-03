import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateReceiptType,
  UpdateReceiptType,
} from '../validations/receiptSchema';

export async function getAllReceiptsService() {
  const whereClause: any = {};
  // OR
  // const whereClause: Prisma.UserWhereInput = {} // for type safety

  // if (query.email) {
  //   whereClause.email = query.email;
  // }

  return await prisma.receipt.findMany({
    where: whereClause,
  });
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
    },
    select: {
      id: true,
      payment_method: true,
      invoice_id: true,
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

  // If invoice_id is being updated, check if new invoice exists
  if (data.invoice_id && data.invoice_id !== existingReceipt.invoice_id) {
    const newInvoice = await prisma.invoice.findUnique({
      where: { id: data.invoice_id },
      select: { id: true },
    });

    if (!newInvoice) throw new NotFoundError('New invoice not found');

    // Check if the new invoice already has a receipt
    const invoiceHasReceipt = await prisma.receipt.findUnique({
      where: { invoice_id: data.invoice_id },
      select: { id: true },
    });
    if (invoiceHasReceipt)
      throw new BadRequestError('Invoice already has a receipt');
  }

  return await prisma.receipt.update({
    where: { id: receiptId },
    data,
    select: {
      id: true,
      payment_method: true,
      invoice_id: true,
    },
  });
}
