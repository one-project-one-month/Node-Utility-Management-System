import * as z from 'zod';
import { UserRole } from '../../generated/prisma';
import { PaginationQueryType } from './paginationSchema';

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

export const GetAllUsersQuerySchema = PaginationQueryType.extend({
  role: z
    .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant")
    .optional(),
  is_active: z
    .string()
    .refine((val) => val === 'true' || val === 'false', {
      message: 'is_active must be either "true" or "false"',
    })
    .transform((val) => val === 'true')
    .optional(),
}).strict();

export const CreateUserSchema = z.object({
  user_name: z.string().min(1, 'Username is required'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z
    .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant'")
    .default(UserRole.Tenant),
  tenant_id: z.uuid({ version: 'v4' }).optional().nullable(),
});

export const UpdateUserSchema = z
  .object({
    user_name: z.string().optional(),
    email: z.email().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
    role: z
      .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant'")
      .optional(),
    tenant_id: z.uuid({ version: 'v4' }).optional().nullable(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;
export type GetAllUsersQueryType = z.infer<typeof GetAllUsersQuerySchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
