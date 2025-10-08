import z from 'zod';

const money_field = z
  .number()
  .refine((val) => Number.isFinite(val) && val > 0, {
    message: 'Amount must be a positive number',
  });

export const GetTenantBillParamSchema = z.object({
  tenant_id: z.uuid({ version: 'v4' }),
});

export const GetBillParamSchema = z.object({
  bill_id: z.uuid({ version: 'v4' }),
});

export const GetBillQuerySchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export const CreateBillSchema = z.object({
  room_id: z.uuid({ version: 'v4' }),
  rental_fee: money_field,
  electricity_fee: money_field,
  water_fee: money_field,
  service_fee: money_field,
  ground_fee: money_field,
  car_parking_fee: money_field.optional(),
  wifi_fee: money_field.optional(),
  fine_fee: money_field.optional(),
  total_amount: money_field,
  due_date: z.coerce.date(),
});

export const UpdateBillSchema = z.object({
  room_id: z.uuid({ version: 'v4' }),
  rental_fee: money_field.optional(),
  electricity_fee: money_field.optional(),
  water_fee: money_field.optional(),
  service_fee: money_field.optional(),
  ground_fee: money_field.optional(),
  car_parking_fee: money_field.optional(),
  wifi_fee: money_field.optional(),
  fine_fee: money_field.optional(),
  total_amount: money_field.optional(),
  due_date: z.coerce.date(),
});

export type GetTenantBillParamType = z.infer<typeof GetTenantBillParamSchema>;
export type GetUserParamType = z.infer<typeof GetBillParamSchema>;
export type GetBillQueryType = z.infer<typeof GetBillQuerySchema>;
export type CreateBillType = z.infer<typeof CreateBillSchema>;
export type UpdateBillType = z.infer<typeof UpdateBillSchema>;
