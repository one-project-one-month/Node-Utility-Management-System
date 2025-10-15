import z from 'zod';

export const CreateBillSchema = z.object({
  room_id: z.uuid({ version: 'v4' }),
  rental_fee: z
    .number()
    .positive({ message: 'Rental fee must be a positive number' }),
  electricity_fee: z
    .number()
    .positive({ message: 'Electricity fee must be a positive number' }),
  water_fee: z
    .number()
    .positive({ message: 'Water fee must be a positive number' }),
  fine_fee: z
    .number()
    .positive({ message: 'Fine fee must be a positive number' })
    .optional(),
  service_fee: z
    .number()
    .positive({ message: 'Service fee must be a positive number' })
    .optional(),
  ground_fee: z
    .number()
    .positive({ message: 'Ground fee must be a positive number' }),
  car_parking_fee: z
    .number()
    .positive({ message: 'Card Parking fee must be a positive number' })
    .optional(),
  wifi_fee: z
    .number()
    .positive({ message: 'Wifi fee must be a positive number' })
    .optional(),
  total_amount: z
    .number()
    .positive({ message: 'Total amount must be a positive number' })
    .optional(),
  due_date: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid due date',
  }),
  created_date: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid created date',
  }),
  updated_at: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid updated date',
    })
    .optional(),
});

export const UpdateBillSchema = z
  .object({
    room_id: z.uuid({ version: 'v4' }).optional(),
    rental_fee: z.number().optional(),
    electricity_fee: z.number().optional(),
    water_fee: z.number().optional(),
    fine_fee: z.number().optional(),
    service_fee: z.number().optional(),
    ground_fee: z.number().optional(),
    car_parking_fee: z.number().optional(),
    wifi_fee: z.number().optional(),
    total_amount: z.number().optional(),
    due_date: z.coerce.date().optional(),
    created_date: z.coerce.date().optional(),
    updated_date: z.coerce.date().optional(),
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

export type CreateBillSchemaType = z.infer<typeof CreateBillSchema>;
export type UpdateBillSchemaType = z.infer<typeof UpdateBillSchema>;
export type GetBillByIdSchemaType = z.infer<typeof GetBillByIdSchema>;
export type GetBillByTenantIdSchemaType = z.infer<
  typeof GetBillByTenantIdSchema
>;
