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
import {
  INVOICES_FLATTENER_CONFIG,
  universalFlattener,
} from '../common/utils/obj-flattener';

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

export async function getAllInvoicesService(req: Request) {
  const query = req.validatedQuery as GetInvoiceQueryType;
  const { startDate, endDate } = getTimeLimitQuery(query);
  const whereClause: Prisma.InvoiceWhereInput = {
    status: query.status,
  };
  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // The final where clause based on date filters
  const finalWhereClause: Prisma.InvoiceWhereInput = {
    ...whereClause,
    ...(startDate &&
      endDate && {
        createdAt: { gte: startDate, lte: endDate },
      }),
  };

  // Get users and totalCount with pagination
  const [invoices, totalCount] = await prisma.$transaction([
    prisma.invoice.findMany({
      where: finalWhereClause,
      include: {
        bill: {
          select: {
            totalAmount: true,
            dueDate: true,
            room: {
              select: {
                roomNo: true,
                tenant: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
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
  const data = universalFlattener(invoices, INVOICES_FLATTENER_CONFIG);

  return {
    data,
    ...paginationData,
  };
}

export async function updateInvoiceService(
  param: GetInvoiceParamType,
  body: UpdateInvoiceType
) {
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: param.invoiceId },
  });

  if (existingInvoice?.billId !== body.billId) {
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
        receiptSent: body.receiptSent,
      },
    });
  }
}

export async function getInvoiceService(param: GetInvoiceParamType) {
  const existingInvoice = await prisma.invoice.findUnique({
    where: { id: param.invoiceId },
  });

  if (!existingInvoice) {
    throw new NotFoundError('Invoice ID does not exist.');
  }
  const invoice = await prisma.invoice.findFirst({
    where: { id: param.invoiceId },
    include: {
      receipt: {
        select: {
          paymentMethod: true,
          paidDate: true,
        },
      },
      bill: {
        include: {
          room: {
            select: {
              roomNo: true,
              tenant: {
                select: {
                  name: true,
                },
              },
              contract: {
                take: 1,
                orderBy: { createdDate: 'desc' },
                select: {
                  contractType: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!invoice) {
    throw new NotFoundError('Invoice not found.');
  }
  const { room, ...billWithoutRoom } = invoice.bill;

  const data = {
    ...invoice,
    bill: billWithoutRoom,
    tenantName: room.tenant?.name,
    roomNo: room.roomNo,
    contractTypeName: room.contract[0]?.contractType?.name || null,
  };

  return data;
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

export async function getTenantInvoiceHistoryService(req: Request) {
  const param = req.params as GetTenantInvoiceParamType;
  const query = req.validatedQuery as GetInvoiceQueryType;

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

  const finalWhereClause: Prisma.InvoiceWhereInput = {
    ...whereClause,
    ...(startDate &&
      endDate && {
        createdAt: { gte: startDate, lte: endDate },
      }),
  };

  // Get users and totalCount with pagination
  const [invoices, totalCount] = await prisma.$transaction([
    prisma.invoice.findMany({
      where: finalWhereClause,
      include: {
        bill: {
          select: {
            totalAmount: true,
            dueDate: true,
            room: {
              select: {
                roomNo: true,
                tenant: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
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
  const data = universalFlattener(invoices, INVOICES_FLATTENER_CONFIG);

  return {
    data,
    ...paginationData,
  };
}
