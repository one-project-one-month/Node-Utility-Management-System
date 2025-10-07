import prisma from '../lib/prismaClient';
import {
  CreateInvoiceType,
  GetInvoiceParamType,
  UpdateInvoiceType,
} from '../validations/invoiceSchema';

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

export async function getAllInvoicesService() {
  return prisma.invoice.findMany();
}

export async function updateInvoiceService(
  param: GetInvoiceParamType,
  body: UpdateInvoiceType
) {
  return prisma.invoice.update({
    where: { id: param.invoice_id },
    data: { ...body },
  });
}

export async function getInvoiceService(param: GetInvoiceParamType) {
  return prisma.invoice.findFirst({
    where: { id: param.invoice_id },
  });
}
