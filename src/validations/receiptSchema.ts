import z from 'zod';
import { PaymentMethod } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

export const GetReceiptParamSchema = z.object({
  id: z.uuid({ version: 'v4' }),
});

export const GetReceiptByInvoiceParamSchema = z.object({
  invoiceId: z.uuid({ version: 'v4' }),
});

export const GetReceiptByTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export const GetAllReceiptsQuerySchema = PaginationQuerySchema.extend({
  payment_method: z
    .enum(
      PaymentMethod,
      "Payment method must be one of 'Cash' or 'Mobile_Banking'"
    )
    .optional(),
}).strict();

export const CreateReceiptSchema = z.object({
  payment_method: z.enum(
    PaymentMethod,
    "Payment method must be one of 'Cash' or 'Mobile_Banking'"
  ),
  paid_date: z.coerce.date().optional(),
  invoice_id: z.uuid({ version: 'v4' }),
});

export const UpdateReceiptSchema = z
  .object({
    payment_method: z
      .enum(
        PaymentMethod,
        "Payment method must be one of 'Cash' or 'Mobile_Banking'"
      )
      .optional(),
    paid_date: z.coerce.date().optional(),
    invoice_id: z.uuid({ version: 'v4' }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export type GetReceiptParamType = z.infer<typeof GetReceiptParamSchema>;
export type GetReceiptByInvoiceParamType = z.infer<
  typeof GetReceiptByInvoiceParamSchema
>;
export type GetReceiptByTenantParamType = z.infer<
  typeof GetReceiptByTenantParamSchema
>;
export type GetAllReceiptsQueryType = z.infer<typeof GetAllReceiptsQuerySchema>;
export type CreateReceiptType = z.infer<typeof CreateReceiptSchema>;
export type UpdateReceiptType = z.infer<typeof UpdateReceiptSchema>;
