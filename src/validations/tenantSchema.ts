import { z } from 'zod';

export const CreateTenantSchema = z
  .object({
    names: z.array(z.string().min(1, 'Name is required')),
    emails: z.array(z.email('Invalid email')),
    nrcs: z.array(z.string().min(3, 'NRC is required')),
    phone_nos: z.array(z.string().min(6, 'Phone number is too short')),
    emergency_nos: z.array(z.string().min(6, 'Emergency number is too short')),
    room_id: z.uuid({ version: 'v4' }),
  })
  .refine(
    (data) => {
      const len = data.names.length;
      return data.emails.length === len && data.nrcs.length === len;
    },
    {
      message:
        'Some array fields (names, emails and nrcs) must have the same length',
    }
  );

export const UpdateTenantSchema = z
  .object({
    names: z.array(z.string().min(1, 'Name is required')).optional(),
    emails: z.array(z.email('Invalid email')).optional(),
    nrcs: z.array(z.string().min(3, 'NRC is required')).optional(),
    phone_nos: z
      .array(z.string().min(6, 'Phone number is too short'))
      .optional(),
    emergency_nos: z
      .array(z.string().min(6, 'Emergency number is too short'))
      .optional(),
    room_id: z.uuid({ version: 'v4' }).optional(),
  })
  .refine(
    (data) => {
      // if none of the array fields are provided, it's valid
      if (!data.names && !data.emails && !data.nrcs) {
        return true;
      }

      // pick the first non-undefined array to use as reference length
      const referenceArray = data.names || data.emails || data.nrcs;
      const refLength = referenceArray?.length ?? 0;

      // check each provided array against the reference length
      return (
        (!data.names || data.names.length === refLength) &&
        (!data.emails || data.emails.length === refLength) &&
        (!data.nrcs || data.nrcs.length === refLength)
      );
    },
    {
      message:
        'Some array fields (names, emails and nrcs) must have the same length',
    }
  );
export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantType = z.infer<typeof UpdateTenantSchema>;

export const GetTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export type GetUserParamType = z.infer<typeof GetTenantParamSchema>;

export const GetAllTenantsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1)) // convert to number or default 1
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Page must be a valid number greater than 0',
      }),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10)) // convert to number or default 10
      .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
        message: 'Limit must be a valid number between 1 and 100',
      }),
  })
  .strict();

export type GetAllTenantsQueryType = z.infer<typeof GetAllTenantsQuerySchema>;
