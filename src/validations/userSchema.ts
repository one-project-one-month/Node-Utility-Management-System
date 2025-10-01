import z from 'zod';
import { UserRole } from '../../generated/prisma';

export const CreateUserSchema = z.object({
  user_name: z.string().min(1, 'Username is required'),
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z
    .enum(
      [UserRole.Admin, UserRole.Staff, UserRole.Tenant],
      "Role must be one of 'Admin', 'Staff', or 'Tenant'"
    )
    .default(UserRole.Tenant),
  tenant_id: z.string().optional().nullable(),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;
