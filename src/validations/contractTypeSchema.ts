import * as z from 'zod';

// Create Contract Type
export const CreateContractTypeSchema = z.object({
  name: z.string().min(1, 'Contract type name is required'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  price: z.number().positive('Price must be positive'),
  facilities: z
    .array(z.string().min(1, 'Facility name is required'))
    .nonempty('At least one facility is required.'),
});

// Get Contract Type by contractTypeId
export const GetContractTypeParamSchema = z.object({
  contractTypeId: z.uuid({ version: 'v4' }),
});

// Update Contract Type by contractTypeId
export const UpdateContractTypeSchema = z
  .object({
    name: z.string().optional(),
    duration: z
      .number()
      .int()
      .positive('Duration must be a positive integer')
      .optional(),
    price: z.number().positive('Price must be positive').optional(),
    facilities: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type CreateContractTypeSchemaType = z.infer<
  typeof CreateContractTypeSchema
>;

export type GetContractTypeParamSchemaType = z.infer<
  typeof GetContractTypeParamSchema
>;

export type UpdateContractTypeSchemaType = z.infer<
  typeof UpdateContractTypeSchema
>;
