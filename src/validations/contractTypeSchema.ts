import { z } from 'zod';

// Create Contract Type
export const CreateContractTypeSchema = z.object({
  name: z.string().min(1, 'Contract type name is required'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  price: z.number().positive('Price must be positive'),
  facilities: z
    .array(z.string().min(1, 'Facility name is required'))
    .nonempty('At least one facility is requried.'),
});

export type CreateContractTypeSchemaType = z.infer<
  typeof CreateContractTypeSchema
>;

// Get All Contract Types
export const GetAllContractTypesQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Page must be greater than 0',
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
      .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
        message: 'Limit must be between 1 and 100',
      }),
  })
  .strict();

export type GetAllContractTypesQuerySchemaType = z.infer<
  typeof GetAllContractTypesQuerySchema
>;

// Get Contract Type by contractTypeId
export const GetContractTypeParamSchema = z.object({
  contractTypeId: z.uuid({ version: 'v4' }),
});

export type GetContractTypeParamSchemaType = z.infer<
  typeof GetContractTypeParamSchema
>;

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
  .refine(
    (data) => data.name || data.duration || data.price || data.facilities,
    {
      message: 'At least one field must be provided for update',
    }
  );

export type UpdateContractTypeSchemaType = z.infer<
  typeof UpdateContractTypeSchema
>;
