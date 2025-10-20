import * as z from 'zod';
import { InvoiceStatus } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

export const GetTenantInvoiceParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export const GetInvoiceParamSchema = z.object({
  invoiceId: z.uuid({ version: 'v4' }),
});

export const GetInvoiceQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(InvoiceStatus).optional(),
  month: z.string().optional(),
  year: z.string().optional(),
});

export const CreateInvoiceSchema = z.object({
  status: z.enum(InvoiceStatus).default('Pending'),
  dueDate : z.coerce.date().optional(), //overdue checking
  billId: z.uuid({ version: 'v4' }), 
  receiptId: z.uuid({ version: 'v4' }).optional().nullable(),
});

export const UpdateInvoiceSchema = z
  .object({
    status: z
    .enum(InvoiceStatus)
    .optional()
    .refine(
      (InvoiceStatus) => InvoiceStatus !== 'Paid',
      'You cannot set status to PAID manually. It changes automatically when receipt.paidDate is set.'
    ),
    invoiceNo: z.string().optional(),
    dueDate: z.coerce.date().optional(),
    billId: z.uuid({ version: 'v4' }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  })
  .refine((data) => {
    return !data.invoiceNo;
  }, 'you cannot update invoiceNo')
  .strict();

export type GetTenantInvoiceParamType = z.infer<
  typeof GetTenantInvoiceParamSchema
>;
export type GetInvoiceParamType = z.infer<typeof GetInvoiceParamSchema>;
export type GetInvoiceQueryType = z.infer<typeof GetInvoiceQuerySchema>;
export type CreateInvoiceType = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceType = z.infer<typeof UpdateInvoiceSchema>;
