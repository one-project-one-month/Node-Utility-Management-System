import * as z from 'zod';

export const CreateContractSchema = z
  .object({
    room_id: z.uuid({ version: 'v4' }),
    contract_type_id: z.uuid({ version: 'v4' }),
    tenant_id: z.uuid({ version: 'v4' }),
    created_date: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), 'Invalid created date'),
    expiry_date: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), 'Invalid expiry date'),
    updated_date: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), 'Invalid updated date'),
  })
  .strict();

export const UpdateContractSchema = z
  .object({
    room_id: z.uuid({ version: 'v4' }).optional(),
    contract_type_id: z.uuid({ version: 'v4' }).optional(),
    tenant_id: z.uuid({ version: 'v4' }).optional(),
    created_date: z.coerce.date().optional(),
    expiry_date: z.coerce.date().optional(),
    updated_date: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
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
