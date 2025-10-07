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
    //check for required room_id
    .refine((data) => data.room_id !== undefined, {
      message: 'room_id is required.',
      path: ['room_id'],
    })
    .refine(
      (data) =>
        data.names ||
        data.emails ||
        data.nrcs ||
        data.phone_nos ||
        data.emergency_nos,
      {
        message: 'At least one field must be provided for update',
      }
    )
    .refine(
      (data) => {
        const { names, emails, nrcs } = data;
        const tenantFields = [names, emails, nrcs].filter(
          (f) => f !== undefined
        );

        if (tenantFields.length === 3) {
          // All(names,emails,nrcs) provided → their lengths must match
          const firstLength = tenantFields[0]!.length;
          return tenantFields.every((arr) => arr!.length === firstLength);
        }

        // If 1 or 2 fields(names,emails,nrcs) → lengths must match DB
        if (tenantFields.length >= 1) {
          const firstLength = tenantFields[0]!.length;
          return (
            tenantFields.every((arr) => arr!.length === firstLength) &&
            firstLength === expectedLengths.names // match DB tenant count
          );
        }

        // No tenant fields provided → valid
        return true;
      },
      {
        message:
          'The number of names, emails, and NRCs you sent does not match the existing tenants. Please make sure all lists are consistent.',
      }
    )
    .strict();

export const GetTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantType = z.infer<ReturnType<typeof UpdateTenantSchema>>;
export type GetUserParamType = z.infer<typeof GetTenantParamSchema>;
