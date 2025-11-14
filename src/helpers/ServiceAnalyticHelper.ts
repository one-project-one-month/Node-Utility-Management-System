import prisma from '../lib/prismaClient';
import { PriorityLevel, Prisma, ServiceStatus } from '../../generated/prisma';
import { NotFoundError } from '../common/errors';

export const countFieldsHelper = async (
  field: keyof Prisma.CustomerServiceWhereInput,
  values: string[],
  dateRange: Prisma.CustomerServiceWhereInput,
  status?: ServiceStatus
) => {
  const transaction = status
    ? [
        prisma.customerService.count({
          where: { [field]: status, ...dateRange },
        }),
        ...values.map((value) =>
          prisma.customerService.count({
            where: {
              [field]: status,
              priorityLevel: value as PriorityLevel,
              ...dateRange,
            },
          })
        ),
      ]
    : values.map((value) =>
        prisma.customerService.count({
          where: { [field]: value, ...dateRange },
        })
      );

  const counts = await prisma.$transaction(transaction);

  if (!counts) {
    throw new NotFoundError(
      `No service count found for this ${field.toString()} field.`
    );
  }
  return counts;
};

export const serviceDateRangeHelper = (
  from?: Date,
  to?: Date
): Prisma.CustomerServiceWhereInput => {
  const toDate = to ? new Date(to) : new Date();
  const fromDate = from
    ? new Date(from)
    : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  return { issuedDate: { gt: fromDate, lt: toDate } };
};
