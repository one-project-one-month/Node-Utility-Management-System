import * as z from 'zod';

export const CreateContractSchema = z
  .object({
    roomId: z.uuid({ version: 'v4' }),
    contractTypeId: z.uuid({ version: 'v4' }),
    tenantId: z.uuid({ version: 'v4' }),
    createdDate: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), 'Invalid created date'),
    expiryDate: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), 'Invalid expiry date'),
    updatedDate: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), 'Invalid updated date')
      .optional(),
  })
  .strict();

export const UpdateContractSchema = z
  .object({
    roomId: z.uuid({ version: 'v4' }).optional(),
    contractTypeId: z.uuid({ version: 'v4' }).optional(),
    tenantId: z.uuid({ version: 'v4' }).optional(),
    createdDate: z.coerce.date().optional(),
    expiryDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
    path: [
      'roomId',
      'contractTypeId',
      'tenantId',
      'createdDate',
      'expiryDate',
      'updatedDate',
    ],
  });

export const ContractIdSchema = z.object({
  contractId: z.uuid({ version: 'v4' }),
});

export const GetContractByTenantSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export type CreateContractSchemaType = z.infer<typeof CreateContractSchema>;
export type UpdateContractSchemaType = z.infer<typeof UpdateContractSchema>;
export type ContractIdSchemaType = z.infer<typeof ContractIdSchema>;
export type GetContractByTenantSchemaType = z.infer<
  typeof GetContractByTenantSchema
>;
