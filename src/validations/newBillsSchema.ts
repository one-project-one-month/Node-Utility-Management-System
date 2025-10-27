import * as z from 'zod';
import { PaginationQuerySchema } from './paginationSchema';
import { InvoiceStatus } from '../../generated/prisma';

export const CreateBillSchema = z.object({
  roomId: z.uuid({ version: 'v4' }),
  rentalFee: z
    .number()
    .nonnegative({ message: 'Rental fee must be a non-negative number' })
    .optional(),
  electricityFee: z
    .number()
    .nonnegative({ message: 'Electricity fee must be a non-negative number' })
    .optional(),
  waterFee: z
    .number()
    .nonnegative({ message: 'Water fee must be a non-negative number' })
    .optional(),
  fineFee: z
    .number()
    .nonnegative({ message: 'Fine fee must be a non-negative number' })
    .optional(),
  serviceFee: z
    .number()
    .nonnegative({ message: 'Service fee must be a non-negative number' })
    .optional(),
  groundFee: z
    .number()
    .nonnegative({ message: 'Ground fee must be a non-negative number' })
    .optional(),
  carParkingFee: z
    .number()
    .nonnegative({ message: 'Car Parking fee must be a non-negative number' })
    .optional(),
  wifiFee: z
    .number()
    .nonnegative({ message: 'Wifi fee must be a non-negative number' })
    .optional(),
  totalAmount: z
    .number()
    .nonnegative({ message: 'Total amount must be a non-negative number' })
    .optional(),
  dueDate: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      error: 'Invalid due date',
    })
    .optional(),
});

export const UpdateBillSchema = z
  .object({
    roomId: z.uuid({ version: 'v4' }),
    rentalFee: z.number().nonnegative().optional(),
    electricityFee: z.number().nonnegative().optional(),
    waterFee: z.number().nonnegative().optional(),
    fineFee: z.number().nonnegative().optional(),
    serviceFee: z.number().nonnegative().optional(),
    groundFee: z.number().nonnegative().optional(),
    carParkingFee: z.number().nonnegative().optional(),
    wifiFee: z.number().nonnegative().optional(),
    totalAmount: z.number().nonnegative().optional(),
    dueDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export const GetBillByIdSchema = z.object({
  billId: z.uuid({ version: 'v4' }),
});

export const GetBillByTenantIdSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export const GetAllBillQuerySchema = PaginationQuerySchema.extend({
  status: z
    .enum(InvoiceStatus, 'Status must be one of Paid, Overdue, Pending')
    .optional(),
  tenantName: z.string().min(1, 'Tenant name is required').optional(),
  roomNo: z
    .string()
    .min(1, 'Room number is required and choose a positive number in the list')
    .optional(),
  search: z.string().min(1, 'Search cannot be empty')
      .optional(),
});

export type CreateBillSchemaType = z.infer<typeof CreateBillSchema>;
export type UpdateBillSchemaType = z.infer<typeof UpdateBillSchema>;
export type GetBillByIdSchemaType = z.infer<typeof GetBillByIdSchema>;
export type GetBillByTenantIdSchemaType = z.infer<
  typeof GetBillByTenantIdSchema
>;
export type GetAllBillQueryType = z.infer<typeof GetAllBillQuerySchema>;
