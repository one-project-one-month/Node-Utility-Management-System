import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginType = z.infer<typeof LoginSchema>;