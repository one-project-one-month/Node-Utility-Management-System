import * as z from 'zod';
import { UserRole } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

export const GetAllUsersQuerySchema = PaginationQuerySchema.extend({
  role: z
    .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant")
    .optional(),
  isActive: z
    .string()
    .refine((val) => val === 'true' || val === 'false', {
      message: 'isActive must be either "true" or "false"',
    })
    .transform((val) => val === 'true')
    .optional(),
}).strict();

export const CreateUserSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z
    .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant'")
    .default(UserRole.Tenant),
  tenantId: z.uuid({ version: 'v4' }).optional().nullable(),
});

export const UpdateUserSchema = z
  .object({
    userName: z.string().optional(),
    email: z.email().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
    role: z
      .enum(UserRole, "Role must be one of 'Admin', 'Staff', or 'Tenant'")
      .optional(),
    tenantId: z.uuid({ version: 'v4' }).optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
    path: ['userName', 'email', 'password', 'role', 'tenantId', 'isActive'],
  });

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;
export type GetAllUsersQueryType = z.infer<typeof GetAllUsersQuerySchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
