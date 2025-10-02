import z from 'zod';
import { UserRole } from '../../generated/prisma';

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

export const GetUserQuerySchema = z.object({
  email: z.email().optional(),
});

export const CreateUserSchema = z.object({
  user_name: z.string().min(1, 'Username is required'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z
    .enum(
      [UserRole.Admin, UserRole.Staff, UserRole.Tenant],
      "Role must be one of 'Admin', 'Staff', or 'Tenant'"
    )
    .default(UserRole.Tenant),
  tenant_id: z.string().optional().nullable(),
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
      .enum(
        [UserRole.Admin, UserRole.Staff, UserRole.Tenant],
        "Role must be one of 'Admin', 'Staff', or 'Tenant'"
      )
      .optional(),
    tenant_id: z.string().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: 'At least one field must be provided for update',
  });

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;
export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
