import { Request } from 'express';
import { mailTransporter } from '../common/utils/mail-service/mailTransporter';
import { Prisma } from '../../generated/prisma';
import { BadRequestError, NotFoundError } from '../common/errors';
import { generatePaginationData } from '../common/utils/paginationHelper';
import prisma from '../lib/prismaClient';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  CreateReceiptType,
  GetAllReceiptsQueryType,
  SendReceiptEmailType,
  UpdateReceiptType,
} from '../validations/receiptSchema';

export async function getAllReceiptsService(
  query: GetAllReceiptsQueryType,
  req: Request
) {
  const whereClause: Prisma.ReceiptWhereInput = {};

  // Add paymentMethod filter
  if (query.paymentMethod) {
    whereClause.paymentMethod = query.paymentMethod;
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
      orderBy: { createdAt: 'desc' },
    }),
    prisma.receipt.count({ where: whereClause }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: receipts,
    ...paginationData,
  };
}

// Get by id
export async function getReceiptByIdService(receiptId: string) {
  return await prisma.receipt.findUnique({
    where: { id: receiptId },
    select: {
      id: true,
      paymentMethod: true,
      paidDate: true,
      createdAt: true,
      updatedAt: true,
      invoice: true,
    },
  });
}

// Get by invoice id
export async function getReceiptByInvoiceIdService(invoiceId: string) {
  return await prisma.receipt.findUnique({
    where: { invoiceId: invoiceId },
    select: {
      id: true,
      paymentMethod: true,
      paidDate: true,
      createdAt: true,
      updatedAt: true,
      invoice: true,
    },
  });
}

export async function createReceiptService(data: CreateReceiptType) {
  // Check if invoice exists
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    select: { id: true },
  });
  if (!existingInvoice) throw new NotFoundError('Invoice not found');

  // Check if receipt already exists for this invoice
  const existingReceipt = await prisma.receipt.findUnique({
    where: { invoiceId: data.invoiceId },
    select: { id: true },
  });
  if (existingReceipt)
    throw new BadRequestError('Receipt already exists for this invoice');

  // Use <transaction> from prisma
  return await prisma.$transaction(async (tx) => {
    // Create receipt
    const receipt = await tx.receipt.create({
      data: {
        invoiceId: data.invoiceId,
        paymentMethod: data.paymentMethod,
        paidDate: data.paidDate,
      },
      select: {
        id: true,
        paymentMethod: true,
        paidDate: true,
        createdAt: true,
        updatedAt: true,
        invoice: true,
      },
    });

    // Update invoice's status
    await tx.invoice.update({
      where: { id: data.invoiceId },
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
      invoiceId: true,
    },
  });
  if (!existingReceipt) throw new NotFoundError('Receipt not found');

  // Find if invoice exists
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: existingReceipt.invoiceId },
  });
  if (!existingInvoice)
    throw new NotFoundError('Invoice with this receipt not found');

  // Use transaction to update both receipt and invoice status consistently
  return await prisma.$transaction(async (tx) => {
    // Update receipt
    const updatedReceipt = await tx.receipt.update({
      where: { id: receiptId },
      data: {
        paymentMethod: data.paymentMethod,
        paidDate: data.paidDate,
      },
      select: {
        id: true,
        invoiceId: true,
        paymentMethod: true,
        paidDate: true,
        createdAt: true,
        updatedAt: true,
        invoice: true,
      },
    });

    // Update invoice status
    const newInvoiceStatus = data.paidDate ? 'Paid' : 'Pending';
    await tx.invoice.update({
      where: { id: existingReceipt.invoiceId },
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
    orderBy: { createdAt: 'desc' },
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
      orderBy: { createdAt: 'desc' },
    }),
    prisma.receipt.count({ where: whereClause }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: receiptHistories,
    ...paginationData,
  };
}

export async function sendReceiptEmailService(
  data: SendReceiptEmailType
): Promise<object> {
  const { invoiceId, receiptId } = data;

  // Fetch paid status of the invoice
  const paidStatus = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { status: true },
  });

  // Check if invoice is paid
  if (!paidStatus || paidStatus.status !== 'Paid') {
    throw new BadRequestError('Not paid yet. Cannot send receipt email.');
  }

  // Get receipt details along with tenant info
  const receipt = await prisma.receipt.findUnique({
    where: { id: receiptId, paidDate: { not: null } },
    include: {
      invoice: {
        include: {
          bill: {
            include: {
              room: {
                include: {
                  tenant: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  // Get tenant details
  const tenantName = receipt.invoice.bill.room.tenant?.name;
  const tenantEmail = receipt.invoice.bill.room.tenant?.email;
  if (!tenantEmail || !tenantName) {
    throw new BadRequestError('Tenant name or email not found');
  }

  // Prepare mail body
  const htmlContent = `<p>Dear ${tenantName},</p>
    <p>We are pleased to inform you that your payment has been received. Here are the details of your receipt:</p>
    <ul>
      <li><strong>Receipt ID:</strong> ${receipt.id}</li>
      <li><strong>Invoice ID:</strong> ${receipt.invoiceId}</li>
      <li><strong>Invoice No:</strong> ${receipt.invoice.invoiceNo}</li>
      <li><strong>Payment Method:</strong> ${receipt.paymentMethod}</li>
      <li><strong>Paid Date:</strong> ${receipt.paidDate?.toDateString()}</li>
    </ul>
    <p>Thank you for your prompt payment. If you have any questions, feel free to contact us.</p>
    <p>Best regards,<br/>Utility Management Team</p>
  `;

  // prepare mail data
  const [transporter, mailOptions] = await mailTransporter({
    name: tenantName,
    to: tenantEmail,
    subject: 'Your Receipt from Utility Management System for this month',
    htmlContent: htmlContent,
  });

  // Send email
  const info = await transporter.sendMail(mailOptions);

  // Update invoice to mark receipt as sent
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { receiptSent: true },
  });

  // Return payload for response
  return {
    messageId: info.messageId,
    envelope: info.envelope,
    messageTime: info.messageTime,
    messageSize: info.messageSize,
  };
}
