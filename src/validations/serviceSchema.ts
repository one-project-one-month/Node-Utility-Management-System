import * as z from 'zod';
import { PaginationQuerySchema } from './paginationSchema';
import { Category, PriorityLevel, ServiceStatus } from '../../generated/prisma';

export const CreateCustomerServiceSchema = z.object({
  description: z
    .string('Description is required.')
    .min(10, { message: 'Description must be at least 10 characters' }),
  category: z.enum(
    Category,
    "Category must be one of 'Complain', 'Maintenance', or 'Other'"
  ),
  status: z.enum(
    ServiceStatus,
    "Status must be one of 'Pending', 'Ongoing', or 'Resolved'"
  ),
  priorityLevel: z.enum(
    PriorityLevel,
    "Priority Level must be one of 'Low', 'Medium', or 'High'"
  ),
  roomId: z.uuid({ version: 'v4', error: 'Invalid UUID' }),
});

export const UpdateCustomerServiceSchema = z
  .object({
    description: z
      .string('Description is required.')
      .min(10, { message: 'Description must be at least 10 characters' })
      .optional(),
    category: z
      .enum(
        Category,
        "Category must be one of 'Complain', 'Maintenance', or 'Other'"
      )
      .optional(),
    status: z
      .enum(
        ServiceStatus,
        "Status must be one of 'Pending', 'Ongoing', or 'Resolved'"
      )
      .optional(),
    priorityLevel: z
      .enum(
        PriorityLevel,
        "Priority Level must be one of 'Low', 'Medium', or 'High'"
      )
      .optional(),
    roomId: z.uuid({ version: 'v4', error: 'Invalid UUID' }).optional(),
  })
  .refine(
    (data) => data.status !== undefined && data.priorityLevel !== undefined,
    {
      message: 'Both status AND priorityLevel must be provided for update',
    }
  );

export const GetAllServiceQuerySchema = PaginationQuerySchema.extend({
  category: z
    .enum(
      Category,
      "Category must be one of 'Complain', 'Maintenance', or 'Other"
    )
    .optional(),
  status: z
    .enum(
      ServiceStatus,
      "Category must be one of 'Pending', 'Ongoing', or 'Resolved"
    )
    .optional(),
  priorityLevel: z
    .enum(PriorityLevel, "Category must be one of 'Low', 'Medium', or 'High")
    .optional(),
  search: z.string().optional(),
}).strict();

export const TenantIdSchema = z.object({
  id: z.uuid({ version: 'v4', error: 'Invalid UUID' }),
});

export const TenantServiceHistorySchema = PaginationQuerySchema.extend({
  status: z
    .enum(
      ServiceStatus,
      "Status must be one of 'Pending', 'Ongoing', or 'Resolved'"
    )
    .optional(),
});

export type CreateServiceType = z.infer<typeof CreateCustomerServiceSchema>;
export type UpdateServiceType = z.infer<typeof UpdateCustomerServiceSchema>;
export type GetAllServiceQueryType = z.infer<typeof GetAllServiceQuerySchema>;
export type TenantIdType = z.infer<typeof TenantIdSchema>;
export type TenantServiceHistoryType = z.infer<
  typeof TenantServiceHistorySchema
>;
