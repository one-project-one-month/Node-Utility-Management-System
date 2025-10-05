import { z } from 'zod';

export const CreateTenantSchema = z
  .object({
    names: z
      .array(z.string().min(1, 'Name is required'))
      .nonempty('Names cannot be empty'),
    emails: z
      .array(z.email('Invalid email'))
      .nonempty('Emails cannot be empty'),

    nrcs: z
      .array(z.string().min(3, 'NRC is required'))
      .nonempty('NRCs cannot be empty'),
    phone_nos: z
      .array(z.string().min(6, 'Phone number is too short'))
      .nonempty('Phone numbers cannot be empty'),
    emergency_nos: z
      .array(z.string().min(6, 'Emergency number is too short'))
      .nonempty('Emergency numbers cannot be empty'),
    room_id: z.uuid({ message: 'Invalid room ID' }),
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
  )
  .strict();

export const UpdateTenantSchema = (expectedLengths: {
  names: number;
  emails: number;
  nrcs: number;
}) =>
  z
    .object({
      names: z
        .array(z.string().min(1, 'Name is required'))
        .nonempty('Names cannot be empty')
        .optional(),
      emails: z
        .array(z.email('Invalid email'))
        .nonempty('Emails cannot be empty')
        .optional(),
      nrcs: z
        .array(z.string().min(3, 'NRC is required'))
        .nonempty('NRCs cannot be empty')
        .optional(),
      phone_nos: z
        .array(z.string().min(6, 'Phone number is too short'))
        .nonempty('Phone numbers cannot be empty')
        .optional(),
      emergency_nos: z
        .array(z.string().min(6, 'Emergency number is too short'))
        .nonempty('Emergency numbers cannot be empty')
        .optional(),
      room_id: z.uuid({ message: 'Invalid room ID' }).optional(),
    })
    .refine(
      (data) =>
        data.names ||
        data.emails ||
        data.nrcs ||
        data.phone_nos ||
        data.emergency_nos ||
        data.room_id,
      {
        message: 'At least one field must be provided for update',
      }
    )
    .refine(
      (data) => {
        if (data.names && data.names.length !== expectedLengths.names)
          return false;
        if (data.emails && data.emails.length !== expectedLengths.emails)
          return false;
        if (data.nrcs && data.nrcs.length !== expectedLengths.nrcs)
          return false;
        return true;
      },
      {
        message: 'Array length must match the existing data length.',
      }
    )
    .strict();

export const GetTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

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

export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantType = z.infer<ReturnType<typeof UpdateTenantSchema>>;
export type GetUserParamType = z.infer<typeof GetTenantParamSchema>;
export type GetAllTenantsQueryType = z.infer<typeof GetAllTenantsQuerySchema>;
