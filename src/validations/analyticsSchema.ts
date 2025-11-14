import * as z from 'zod';
import { ServiceStatus } from '../../generated/prisma';

export const GetTotalRevenueByMonthSchema = z.object({
  month: z
    .preprocess(
      (val) => Number(val),
      z
        .number({
          message: 'Month must be a number',
        })
        .min(1, { message: 'Month must be between 1 and 12' })
        .max(12, { message: 'Month must be between 1 and 12' })
    )
    .optional(),

  year: z
    .preprocess(
      (val) => Number(val),
      z
        .number({
          message: 'Year must be a number',
        })
        .min(2020, { message: 'Year must be 2020 or later' })
        .max(new Date().getFullYear(), {
          message: 'Year cannot be in the future',
        })
    )
    .optional(),
});

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
  .refine(
    (data) => {
      if (data.from && data.to) {
        return data.from < data.to;
      }
      return true;
    },
    {
      message: "'From' date can't be later than 'To' date.",
      path: ['from'],
    }
  );

export type AnalyticsServiceCount = z.infer<typeof AnalyticsServiceQuerySchema>;
export type GetTotalRevenueByMonthType = z.infer<
  typeof GetTotalRevenueByMonthSchema
>;
