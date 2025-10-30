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

export async function getAllInvoicesService(req: Request) {
  const { page, limit, month, year, status, roomNo, tenantName, search } =
    req.validatedQuery as GetInvoiceQueryType;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (month || year) {
    const { startDate, endDate } = getTimeLimitQuery(month, year);
    whereClause.createdAt = { gt: startDate, lte: endDate };
  }

  if (status) {
    whereClause.status = status;
  }

  if (roomNo || tenantName) {
    whereClause.bill = {
      is: {},
    };

    whereClause.bill.is!.room = {
      is: {},
    };

    if (roomNo) {
      whereClause.bill.is!.room.is!.roomNo = Number(roomNo);
    }

    if (tenantName) {
      whereClause.bill.is!.room.is!.tenant = {
        is: {
          name: {
            contains: tenantName,
            mode: 'insensitive',
          },
        },
      };
    }
  }
  // universal search -> query params [tenant name and roomNo]
  const searchString = search?.toString();

  if (searchString) {
    const searchNumber = isNaN(Number(searchString))
      ? undefined
      : Number(searchString);
    const OR_conditions: any[] = [];

    // For RoomNo
    if (searchNumber !== undefined) {
      OR_conditions.push({
        bill: {
          is: {
            room: {
              is: {
                roomNo: searchNumber,
              },
            },
          },
        },
      });
    } else {
      // For Tenant Name
      OR_conditions.push({
        bill: {
          is: {
            room: {
              is: {
                tenant: {
                  is: {
                    name: {
                      contains: searchString,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // OR will only be applied if search param is provided
    if (OR_conditions.length > 0) {
      whereClause.OR = OR_conditions;
    }
  }

  const [invoices, totalCount] = await prisma.$transaction([
    prisma.invoice.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: whereClause,
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
        receipt: true,
      },
    }),

    prisma.invoice.count({
      where: whereClause,
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

  const { startDate, endDate } = getTimeLimitQuery(query.month, query.year);
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

  return {
    data: invoices,
    ...paginationData,
  };
}
