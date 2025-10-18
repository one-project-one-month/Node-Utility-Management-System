import * as z from 'zod';

export const GetTotalUnitsParamSchema = z.object({
  id: z.uuid({ version: 'v4' }),
});

export const GetTotalUnitsByBillParamSchema = z.object({
  billId: z.uuid({ version: 'v4' }),
});

export const CreateTotalUnitsSchema = z.object({
  electricityUnits: z.number().positive(),
  waterUnits: z.number().positive(),
  billId: z.uuid({ version: 'v4' }),
});

export const UpdateTotalUnitsSchema = z
  .object({
    electricityUnits: z.number().positive().optional(),
    waterUnits: z.number().positive().optional(),
    billId: z.uuid({ version: 'v4' }),
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
