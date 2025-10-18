import z from 'zod';

export const CreateBillSchema = z.object({
  roomId: z.uuid({ version: 'v4' }),
  rentalFee: z
    .number()
    .positive({ message: 'Rental fee must be a positive number' }),
  electricityFee: z
    .number()
    .positive({ message: 'Electricity fee must be a positive number' }),
  waterFee: z
    .number()
    .positive({ message: 'Water fee must be a positive number' }),
  fineFee: z
    .number()
    .positive({ message: 'Fine fee must be a positive number' })
    .optional(),
  serviceFee: z
    .number()
    .positive({ message: 'Service fee must be a positive number' })
    .optional(),
  groundFee: z
    .number()
    .positive({ message: 'Ground fee must be a positive number' }),
  carParkingFee: z
    .number()
    .positive({ message: 'Card Parking fee must be a positive number' })
    .optional(),
  wifiFee: z
    .number()
    .positive({ message: 'Wifi fee must be a positive number' })
    .optional(),
  totalAmount: z
    .number()
    .positive({ message: 'Total amount must be a positive number' })
    .optional(),
  dueDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid due date',
  }),
  createdAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid created date',
  }),
  updatedAt: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid updated date',
    })
    .optional(),
});

export const UpdateBillSchema = z
  .object({
    roomId: z.uuid({ version: 'v4' }).optional(),
    rentalFee: z.number().optional(),
    electricityFee: z.number().optional(),
    waterFee: z.number().optional(),
    fineFee: z.number().optional(),
    serviceFee: z.number().optional(),
    groundFee: z.number().optional(),
    carParkingFee: z.number().optional(),
    wifiFee: z.number().optional(),
    totalAmount: z.number().optional(),
    dueDate: z.coerce.date().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
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
