import { NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';

// Contract analytics
export const contractTypeAnalyticsService = async () => {
  // // Get tenant count grouped by contract type
  // const contracts = await prisma.contract.groupBy({
  //   by: ['contractTypeId'],
  //   _count: {
  //     tenantId: true,
  //   },
  // });

  // if (!contracts.length) {
  //   throw new NotFoundError('No contracts found');
  // }

  // const result = await Promise.all(
  //   contracts.map(async (stat) => {
  //     const contractType = await prisma.contractType.findUnique({
  //       where: { id: stat.contractTypeId },
  //       select: {
  //         name: true,
  //       },
  //     });

  //     return {
  //       contractType,
  //       tenantCount: stat._count.tenantId,
  //     };
  //   })
  // );

  // return result;

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
