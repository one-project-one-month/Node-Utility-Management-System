import * as z from 'zod';
import { RelationshipToTenant } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

export const OccupantSchema = z.object({
  name: z.string().min(1, 'Occupant name is required'),
  nrc: z.string().min(5, 'NRC must be at least 5 characters').optional(),
  relationshipToTenant: z.enum(
    RelationshipToTenant,
    "Relationship must be one of 'SPOUSE','PARENT','CHILD','SIBLING','RELATIVE','FRIEND','OTHER'"
  ),
});

export const CreateTenantSchema = z
  .object({
    name: z.string().min(1, 'Tenant name is required'),
    nrc: z.string().min(5, 'NRC must be at least 5 characters'),
    email: z.email('Invalid email'),
    phoneNo: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Phone number must contain only digits (6–15 characters)'
      ),
    emergencyNo: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Emergency number must contain only digits (6–15 characters)'
      ),
    occupants: z
      .array(OccupantSchema)
      .min(1, 'At least one occupant is required')
      .optional(),
    roomId: z.uuid({ message: 'Invalid room ID' }),
  })
  .strict();

export const UpdateTenantSchema = z
  .object({
    name: z.string().min(1, 'Tenant name is required').optional(),
    nrc: z.string().min(5, 'NRC must be at least 5 characters').optional(),
    email: z.email('Invalid email').optional(),
    phoneNo: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Phone number must contain only digits (6–15 characters)'
      )
      .optional(),
    emergencyNo: z
      .string()
      .regex(
        /^[0-9]{6,15}$/,
        'Emergency number must contain only digits (6–15 characters)'
      )
      .optional(),
    roomId: z.uuid({ message: 'Invalid room ID' }),
    occupantId: z.uuid({ message: 'Invalid occupant ID' }).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.nrc !== undefined ||
      data.email !== undefined ||
      data.phoneNo !== undefined ||
      data.emergencyNo !== undefined,
    {
      message:
        'At least one of name, email,nrc, phoneNo, or emergencyNo must be provided',
    }
  )
  .strict();

export const GetTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export const GetAllTenantQuerySchema = PaginationQuerySchema.extend({
  name: z.string().min(1, 'Tenant name is required').optional(),
  email: z.email('Invalid email').optional(),
  phoneNo: z
    .string()
    .regex(
      /^[0-9]{6,15}$/,
      'Phone number must contain only digits (6–15 characters)'
    )
    .optional(),
  roomNo: z
    .string()
    .min(1, 'Room number is required and choose a positive number in the list')
    .optional(),
  contractType: z.string().min(1, 'Contract type name is required').optional(),
  search: z.string().min(1, 'Search query cannot be empty').optional(),
  occupantCounts: z
    .string()
    .refine((data) => Number(data) && Number(data) > 0, {
      message: 'occupant filter must be number and greater than 0',
    })
    .optional(),
  minOccupants: z
    .string()
    .refine((data) => Number(data) && Number(data) > 0, {
      message: 'occupant filter must be number and greater than 0',
    })
    .optional(),
  maxOccupants: z
    .string()
    .refine((data) => Number(data) && Number(data) > 0, {
      message: 'occupant filter must be number and greater than 0',
    })
    .optional(),
});

export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantType = z.infer<typeof UpdateTenantSchema>;
export type GetTenantParamType = z.infer<typeof GetTenantParamSchema>;
export type GetAllTenantQueryType = z.infer<typeof GetAllTenantQuerySchema>;
