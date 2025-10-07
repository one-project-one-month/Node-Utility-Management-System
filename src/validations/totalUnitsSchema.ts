import z from 'zod';

export const GetTotalUnitsParamSchema = z.object({
  id: z.uuid({ version: 'v4' }),
});

export const GetTotalUnitsByBillParamSchema = z.object({
  billId: z.uuid({ version: 'v4' }),
});

export const CreateTotalUnitsSchema = z.object({
  electricity_units: z.number().positive(),
  water_units: z.number().positive(),
  bill_id: z.uuid({ version: 'v4' }),
});

export const UpdateTotalUnitsSchema = z
  .object({
    electricity_units: z.number().positive().optional(),
    water_units: z.number().positive().optional(),
    bill_id: z.uuid({ version: 'v4' }).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export type GetTotalUnitsParamType = z.infer<typeof GetTotalUnitsParamSchema>;
export type GetTotalUnitsByBillParamType = z.infer<
  typeof GetTotalUnitsByBillParamSchema
>;
export type CreateTotalUnitsType = z.infer<typeof CreateTotalUnitsSchema>;
export type UpdateTotalUnitsType = z.infer<typeof UpdateTotalUnitsSchema>;
