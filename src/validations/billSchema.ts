import z from 'zod';
import { PaginationQuerySchema } from './paginationSchema';

const moneyField = z.number().refine((val) => Number.isFinite(val) && val > 0, {
  message: 'Amount must be a positive number',
});

export const GetTanentBillParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export const GetBillParamSchema = z.object({
  billId: z.uuid({ version: 'v4' }),
});

export const GetBillQuerySchema = PaginationQuerySchema.extend({
  month: z.string().optional(),
  year: z.string().optional(),
});

export const CreateBillSchema = z.object({
  room_id: z.uuid({ version: 'v4' }),
  rental_fee: moneyField,
  electricity_fee: moneyField,
  water_fee: moneyField,
  service_fee: moneyField,
  ground_fee: moneyField,
  car_parking_fee: moneyField.optional(),
  wifi_fee: moneyField.optional(),
  fine_fee: moneyField.optional(),
  total_amount: moneyField,
  due_date: z.coerce.date(),
});

export const UpdateBillSchema = z
  .object({
    room_id: z.uuid({ version: 'v4' }),
    rental_fee: moneyField.optional(),
    electricity_fee: moneyField.optional(),
    water_fee: moneyField.optional(),
    service_fee: moneyField.optional(),
    ground_fee: moneyField.optional(),
    car_parking_fee: moneyField.optional(),
    wifi_fee: moneyField.optional(),
    fine_fee: moneyField.optional(),
    total_amount: moneyField.optional(),
    due_date: z.coerce.date(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be updated.',
  });
export type GetTanentBillParamType = z.infer<typeof GetTanentBillParamSchema>;
export type GetBillParamType = z.infer<typeof GetBillParamSchema>;
export type GetBillQueryType = z.infer<typeof GetBillQuerySchema>;
export type CreateBillType = z.infer<typeof CreateBillSchema>;
export type UpdateBillType = z.infer<typeof UpdateBillSchema>;
