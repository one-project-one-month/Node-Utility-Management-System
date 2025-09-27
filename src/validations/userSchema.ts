import z from "zod";

export const GetUserQuerySchema = z.object({
  userId: z.uuid({ version: "v4" }),
});

export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>;

export const CreateUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;
