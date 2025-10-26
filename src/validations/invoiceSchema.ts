import * as z from 'zod';
import { InvoiceStatus } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

const MonthEnum = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const GetTenantInvoiceParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export const GetInvoiceParamSchema = z.object({
  invoiceId: z.uuid({ version: 'v4' }),
});

export const GetInvoiceQuerySchema = PaginationQuerySchema.extend({
  status: z
    .enum(InvoiceStatus, {
      error: "Status must be one of 'Pending', 'Paid', 'Partial', 'Overdue'",
    })
    .optional(),
  month: z
    .enum(MonthEnum, {
      error:
        "Month must be one of 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'",
    })
    .optional(),
  year: z
    .string()
    .length(4, { message: 'Year must be exactly 4 digits' })
    .regex(/^\d+$/, { message: 'Year must contain only numbers' })
    .refine(
      (year) => {
        const yearNum = parseInt(year);
        return yearNum >= 2020 && yearNum <= 2030;
      },
      { message: 'Year must be between 2020 and 2030' }
    )
    .optional(),
});

export const CreateInvoiceSchema = z.object({
  status: z.enum(InvoiceStatus).default('Pending'),
  billId: z.uuid({ version: 'v4' }),
});

export const UpdateInvoiceSchema = z
  .object({
    status: z.enum(InvoiceStatus).default('Pending').optional(),
    invoiceNo: z.string().optional(),
    receiptSent: z.boolean().optional(),
    billId: z.uuid({ version: 'v4' }),
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
