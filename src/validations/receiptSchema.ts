import z from 'zod';
import { PaymentMethod } from '../../generated/prisma';

export const GetReceiptParamSchema = z.object({
  id: z.uuid({ version: 'v4' }),
});

export const GetReceiptByInvoiceParamSchema = z.object({
  invoiceId: z.uuid({ version: 'v4' }),
});

// export const GetUserQuerySchema = z.object({
//   email: z.email().optional(),
// });

export const CreateReceiptSchema = z.object({
  payment_method: z.enum(
    [PaymentMethod.Cash, PaymentMethod.Mobile_Banking],
    "Payment method must be one of 'Cash' or 'Mobile Banking'"
  ),
  // .default(PaymentMethod.Mobile_Banking),
  invoice_id: z.string(),
});

export const UpdateReceiptSchema = z
  .object({
    payment_method: z.enum(
      [PaymentMethod.Cash, PaymentMethod.Mobile_Banking],
      "Payment method must be one of 'Cash' or 'Mobile Banking'"
    ),
    // .default(PaymentMethod.Mobile_Banking),
    invoice_id: z.string(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export type GetReceiptParamType = z.infer<typeof GetReceiptParamSchema>;
export type GetReceiptByInvoiceParamType = z.infer<typeof GetReceiptByInvoiceParamSchema>;
// export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>;
export type CreateReceiptType = z.infer<typeof CreateReceiptSchema>;
export type UpdateReceiptType = z.infer<typeof UpdateReceiptSchema>;
