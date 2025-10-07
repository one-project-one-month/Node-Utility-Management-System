import z from 'zod';

export const LogInSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LogInType = z.infer<typeof LogInSchema>;
