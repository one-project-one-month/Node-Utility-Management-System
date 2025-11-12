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

  const flatten = contractTypes.map((ct) => ({
    contractType: ct.name,
    tenantCount: ct._count.contract,
  }));

  return flatten;
};

// Room analytics
export const roomAnalyticsService = async () => {
  const roomData = await prisma.room.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });

  if (!roomData.length) throw new NotFoundError('No room data found');

  const flatten = roomData.map((rd) => ({
    status: rd.status,
    count: rd._count.status,
  }));

  return flatten;
};
