import z from 'zod';

export const createCustomerServiceSchema = z.object({
  description: z
    .string('Description is required.')
    .min(10, { message: 'Description must be at least 10 characters' }),
  category: z.enum(
    ['Complain', 'Maintenance', 'Other'],
    "Category must be one of 'Complain', 'Maintenance', or 'Other'"
  ),
  status: z.enum(
    ['Pending', 'Ongoing', 'Resolved'],
    "Status must be one of 'Pending', 'Ongoing', or 'Resolved'"
  ),
  priority_level: z.enum(
    ['Low', 'Medium', 'High'],
    "Priority Level must be one of 'Low', 'Medium', or 'High'"
  ),
  room_id: z.uuid({ version: 'v4', error: 'Invalid UUID' }),
});

export const updateCustomerServiceSchema = z
  .object({
    description: z
      .string('Description is required.')
      .min(10, { message: 'Description must be at least 10 characters' })
      .optional(),
    category: z
      .enum(
        ['Complain', 'Maintenance', 'Other'],
        "Category must be one of 'Complain', 'Maintenance', or 'Other'"
      )
      .optional(),
    status: z
      .enum(
        ['Pending', 'Ongoing', 'Resolved'],
        "Status must be one of 'Pending', 'Ongoing', or 'Resolved'"
      )
      .optional(),
    priority_level: z
      .enum(
        ['Low', 'Medium', 'High'],
        "Priority Level must be one of 'Low', 'Medium', or 'High'"
      )
      .optional(),
    room_id: z.uuid({ version: 'v4', error: 'Invalid UUID' }).optional(),
  })
  .refine(
    (data) => data.status !== undefined && data.priority_level !== undefined,
    {
      message: 'Both status AND priority_level must be provided for update',
    }
  );

export const idSchema = z.object({
  id: z.uuid({ version: 'v4', error: 'Invalid UUID' }),
});

export const tenantIdAndStatusSchema = z.object({
  id: z.uuid({ version: 'v4', error: 'Invalid UUID' }),
  status: z.enum(
    ['Pending', 'Ongoing', 'Resolved'],
    "Status must be one of 'Pending', 'Ongoing', or 'Resolved'"
  ),
});

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number') // ensure numeric string
    .transform(Number) // convert to number
    .refine((val) => val > 0, 'Page must be greater than 0')
    .default(1),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .default(10),
});

export type createServiceType = z.infer<typeof createCustomerServiceSchema>;
export type updateServiceType = z.infer<typeof updateCustomerServiceSchema>;
export type paginationQueryType = z.infer<typeof paginationQuerySchema>;
export type tenantIdAndStatusType = z.infer<typeof tenantIdAndStatusSchema>;
