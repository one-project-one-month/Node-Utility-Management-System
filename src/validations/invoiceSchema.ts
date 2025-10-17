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
  bill_id: z.uuid({ version: 'v4' }),
});

export const UpdateInvoiceSchema = z
  .object({
    status: z.enum(InvoiceStatus).default('Pending').optional(),
    invoice_no: z.string().optional(),
    bill_id: z.uuid({ version: 'v4' }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  })
  .refine((data) => {
    return !data.invoice_no;
  }, 'you cannot update invoice_no')
  .strict();

export type GetTenantInvoiceParamType = z.infer<
  typeof GetTenantInvoiceParamSchema
>;
export type GetInvoiceParamType = z.infer<typeof GetInvoiceParamSchema>;
export type GetInvoiceQueryType = z.infer<typeof GetInvoiceQuerySchema>;
export type CreateInvoiceType = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceType = z.infer<typeof UpdateInvoiceSchema>;
