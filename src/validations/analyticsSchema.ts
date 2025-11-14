import * as z from 'zod';

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

export type GetTotalRevenueByMonthType = z.infer<
  typeof GetTotalRevenueByMonthSchema
>;
