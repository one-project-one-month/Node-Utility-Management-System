import z from "zod";

export const GetUserParamSchema = z.object({
  userId: z.uuid({ version: "v4" }),
});

export type GetUserParamType = z.infer<typeof GetUserParamSchema>;

export const CreateUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;