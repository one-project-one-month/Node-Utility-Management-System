import z from 'zod';
import { InvoiceStatus } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

// id     String        @id @default(uuid())
//   status InvoiceStatus

//   // relations
//   bill       Bill     @relation(fields: [bill_id], references: [id])
//   bill_id    String   @unique
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt

//   receipt Receipt?

export const GetTenantInvoiceParamSchema = z.object({
  tenant_id: z.uuid({ version: 'v4' }),
});

export const GetInvoiceParamSchema = z.object({
  invoice_id: z.uuid({ version: 'v4' }),
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

export const UpdateInvoiceSchema = z.object({
  status: z.enum(InvoiceStatus).default('Pending').optional(),
  bill_id: z.uuid({ version: 'v4' }).optional(),
});

export type GetTenantInvoiceParamType = z.infer<
  typeof GetTenantInvoiceParamSchema
>;
export type GetInvoiceParamType = z.infer<typeof GetInvoiceParamSchema>;
export type GetInvoiceQueryType = z.infer<typeof GetInvoiceQuerySchema>;
export type CreateInvoiceType = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceType = z.infer<typeof UpdateInvoiceSchema>;
