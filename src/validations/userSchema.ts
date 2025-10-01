// src/validations/userSchema.ts

import z from 'zod';

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

export const GetUserQuerySchema = z.object({
  email: z.email().optional(),
});

export const CreateUserSchema = z.object({
  user_name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(['Admin', 'Tenant', 'Staff']),
  is_active: z.boolean(),
});

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;
export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;