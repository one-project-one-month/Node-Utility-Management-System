import z from 'zod';

export const CreateContractSchema = z.object({
  roomNo: z.number().int().positive({ message: 'Room is required' }),
  contractTypeId: z
    .string({ message: 'Contract type is required' })
    .uuid({ version: 'v4' }),
  tenantId: z.string({ message: 'Tenant is required' }).uuid({ version: 'v4' }),
  createdDate: z.string().datetime('Invalid created date'),
  expiryDate: z.string().datetime('Invalid updated date'),
});

export const UpdateContractSchema = z
  .object({
    roomNo: z.number().int().positive().optional(),
    contractTypeId: z
      .string({ message: 'Contract type is required' })
      .uuid({ version: 'v4' })
      .optional(),
    tenantId: z
      .string({ message: 'Tenant is required' })
      .uuid({ version: 'v4' })
      .optional(),
    createdDate: z.string().datetime().optional(),
    expiryDate: z.string().datetime().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export const ContractIdSchema = z.object({
  contractId: z
    .string({ message: 'Contract ID is required' })
    .uuid({ version: 'v4' }),
});

export const GetAllContractSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .refine((val) => !isNaN(val) && val > 0, 'Page must be greater than 0'),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
      .refine((val) => !isNaN(val) && val > 0, 'Limit must be greater than 0'),
  })
  .strict();

export const GetContractByTenantSchema = z.object({
  tenantId: z
    .string({ message: 'Tenant ID is required' })
    .uuid({ version: 'v4' }),
});

export type CreateContractSchemaType = z.infer<typeof CreateContractSchema>;
export type UpdateContractSchemaType = z.infer<typeof UpdateContractSchema>;
export type ContractIdSchemaType = z.infer<typeof ContractIdSchema>;
export type GetAllContractSchemaType = z.infer<typeof GetAllContractSchema>;
export type GetContractByTenantSchemaType = z.infer<
  typeof GetContractByTenantSchema
>;
