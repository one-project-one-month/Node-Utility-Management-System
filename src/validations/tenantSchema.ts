import * as z from 'zod';
import { RelationshipToTenant } from '../../generated/prisma';

export const OccupantSchema = z.object({
  name: z.string().min(1, 'Occupant name is required'),
  nrc: z.string().min(5, 'NRC must be at least 5 characters').optional(),
  relationshipToTenant: z.enum(
    RelationshipToTenant,
    "Relationship must be one of 'SPOUSE','PARENT','CHILD','SIBLING','RELATIVE','FRIEND','OTHER'"
  ),
  tenant_id: z.uuid({ version: 'v4' }).optional().nullable(),
});

export const CreateTenantSchema = z
  .object({
    name: z.string().min(1, 'Tenant name is required'),
    nrc: z.string().min(5, 'NRC must be at least 5 characters'),
    email: z.email('Invalid email'),
    phone_no: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Phone number must contain only digits (6–15 characters)'
      ),
    emergency_no: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Emergency number must contain only digits (6–15 characters)'
      ),
    occupants: z
      .array(OccupantSchema)
      .min(1, 'At least one occupant is required')
      .optional(),
    room_id: z.uuid({ message: 'Invalid room ID' }),
  })
  .strict();

export const UpdateTenantSchema = z
  .object({
    name: z.string().min(1, 'Tenant name is required').optional(),
    nrc: z.string().min(5, 'NRC must be at least 5 characters').optional(),
    email: z.email('Invalid email').optional(),
    phone_no: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Phone number must contain only digits (6–15 characters)'
      )
      .optional(),
    emergency_no: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Emergency number must contain only digits (6–15 characters)'
      )
      .optional(),
    room_id: z.uuid({ message: 'Invalid room ID' }),
    occupant_id: z.uuid({ message: 'Invalid occupant ID' }),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.nrc !== undefined ||
      data.email !== undefined ||
      data.phone_no !== undefined ||
      data.emergency_no !== undefined,
    {
      message:
        'At least one of name, email,nrc, phone_no, or emergency_no must be provided',
    }
  )
  .strict();

export const GetTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantType = z.infer<typeof UpdateTenantSchema>;
export type GetUserParamType = z.infer<typeof GetTenantParamSchema>;
