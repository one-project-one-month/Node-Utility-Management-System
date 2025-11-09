import { NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';

// Contract analytics
export const contractTypeAnalyticsService = async () => {
  const contractTypes = await prisma.contractType.findMany({
    select: {
      name: true,
      _count: {
        select: {
          contract: true,
        },
      },
    },
  });

  if (!contractTypes.length) throw new NotFoundError('No contract types found');

  return contractTypes;
};
