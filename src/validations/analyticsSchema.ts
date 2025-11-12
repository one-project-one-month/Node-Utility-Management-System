import * as z from 'zod';
import { ServiceStatus } from '../../generated/prisma';

export const AnalyticsServiceQuerySchema = z
  .object({
    query: z.enum(
      ['priority', 'category', 'status'],
      'Query must be one of priority, category or status.'
    ),
    status: z
      .enum(
        ServiceStatus,
        'Category must be one of Pending, Ongoing, or Resolved'
      )
      .optional(),
    from: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), {
        error: 'Invalid due date',
      })
      .optional(),
    to: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), {
        error: 'Invalid due date',
      })
      .optional(),
  })
  // .refine(
  //   (data) => {
  //     if (data.from && data.to) {
  //       return data.from < data.to;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "'From' date cannot be later than 'To' date.",
  //     path: ['from', 'to'],
  //   }
  // );
  .refine((data) => data.to && data.from && data.from < data.to, {
    message: "'From' date cannot be later than 'To' date.",
    path: ['from', 'to'],
  });

export type AnalyticsServiceCount = z.infer<typeof AnalyticsServiceQuerySchema>;
