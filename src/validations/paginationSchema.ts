import * as z from "zod";

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number') // ensure numeric string
    .transform(Number) // convert to number
    .refine((val) => val > 0, 'Page must be greater than 0')
    .optional()
    .default(1),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default(10),
}).strict();

export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>