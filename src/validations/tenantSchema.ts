import { z } from 'zod';
import { PaginationQuerySchema } from './paginationSchema';

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
  //at least one field must be provided
  .refine(
    (data) =>
      data.names ||
      data.emails ||
      data.nrcs ||
      data.phone_nos ||
      data.emergency_nos ||
      data.room_id,
      // Object.keys(data).length > 0, // cmt: Object.keys(data).length > 0 will be more efficient
    {
      message: 'At least one field must be provided for update',
    }
  )
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

export const GetTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantType = z.infer<typeof UpdateTenantSchema>;
export type GetUserParamType = z.infer<typeof GetTenantParamSchema>;
