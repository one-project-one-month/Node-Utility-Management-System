import { Request } from 'express';
import { BadRequestError } from '../common/errors/badRequestError';
import { NotFoundError } from '../common/errors/notFoundError';
import { checkDuplicateTenantData } from '../helpers/checkDuplicateTenantData';
import prisma from '../lib/prismaClient';
import {
  CreateTenantType,
  GetAllTenantQueryType,
  UpdateTenantType,
} from '../validations/tenantSchema';
import { generatePaginationData } from '../common/utils/paginationHelper';
import { Prisma } from '../../generated/prisma';

export async function createTenantService(data: CreateTenantType) {
  const {
    name,
    nrc,
    email,
    phoneNo,
    emergencyNo,
    occupants = [],
    roomId,
  } = data;
  //Check if room exists
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    throw new BadRequestError('Room not found');
  }

  const existingTenantForRoom = await prisma.tenant.findUnique({
    where: { roomId },
  });
  if (existingTenantForRoom)
    throw new BadRequestError('Room already occupied!');

  //Gather all NRCs for duplicate check
  const allNrcsToCheck: string[] = [
    nrc,
    ...occupants
      .map((occupant) => occupant.nrc)
      .filter((nrc): nrc is string => !!nrc),
  ];

  //Check for duplicates tenant data
  await checkDuplicateTenantData(allNrcsToCheck, email);

  return await prisma.tenant.create({
    data: {
      name,
      nrc,
      email,
      phoneNo,
      emergencyNo,
      roomId,
      occupants: {
        create: occupants.map((occupant) => ({
          name: occupant.name,
          nrc: occupant.nrc ?? null,
          relationshipToTenant: occupant.relationshipToTenant,
        })),
      },
    },
    include: {
      occupants: true,
      room: true,
      contract: {
        include: {
          contractType: true,
        },
      },
    },
  });
}

export async function updateTenantService(
  tenantId: string,
  data: UpdateTenantType
) {
  //check tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { occupants: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  // Check that the provided roomId exists
  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
  });
  if (!room) throw new NotFoundError('Room not found.');

  // Ensure the provided roomId matches the tenant’s current roomId
  if (tenant.roomId !== data.roomId) {
    throw new BadRequestError(
      'RoomId mismatch: tenant is not assigned to this room.'
    );
  }

  // Ensure occupant belongs to this tenant
  if (data.occupantId) {
    const occupant = await prisma.occupant.findUnique({
      where: { id: data.occupantId },
    });

    if (!occupant || occupant.tenantId !== tenant.id) {
      throw new BadRequestError('Invalid occupant for this tenant.');
    }
  }

  //Check for duplicates excluding the current tenant
  await checkDuplicateTenantData(
    data.nrc ? [data.nrc] : undefined,
    data.email ?? undefined,
    tenantId
  );

  // Finally update
  return await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.nrc && { nrc: data.nrc }),
      ...(data.phoneNo && { phoneNo: data.phoneNo }),
      ...(data.emergencyNo && { emergencyNo: data.emergencyNo }),
    },
    include: {
      occupants: true,
      room: true,
    },
  });
}

export async function getByIdTenantService(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      room: true,
      occupants: true,
      contract: {
        include: {
          contractType: true,
        },
      },
    },
  });
  if (!tenant) {
    throw new NotFoundError('Tenant Not Found');
  }
  return tenant;
}

export async function getAllTenantService(req: Request) {
  const query = req.validatedQuery as GetAllTenantQueryType;
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.TenantWhereInput = {};

  if (query.name) {
    whereClause.name = { contains: query.name, mode: 'insensitive' };
  }
  if (query.email) {
    whereClause.email = query.email;
  }
  if (query.phoneNo) {
    whereClause.phoneNo = query.phoneNo;
  }

  if (query.roomNo) {
    whereClause.room = {
      is: {
        roomNo: Number(query.roomNo),
      },
    };
  }

  if (query.contractType) {
    whereClause.contract = {
      is: {
        contractType: {
          is: {
            name: query.contractType,
          },
        },
      },
    };
  }

  // const minCount = query.minOccupants ? Number(query.minOccupants) : undefined;
  // const maxCount = query.maxOccupants ? Number(query.maxOccupants) : undefined;
  // const exactCount = query.occupantCounts ? Number(query.occupantCounts) : undefined;

  // if (exactCount) {
  //   whereClause.occupants = {
  //     _count: { equals: exactCount }
  //   };
  // } else if (minCount || maxCount) {
  //   whereClause.occupants = {
  //     _count: {
  //       ...(minCount && { gte: minCount }),
  //       ...(maxCount && { lte: maxCount }),
  //     }
  //   };
  // }

  // Handle occupant count filtering
  let occupantFilteredTenantIds: string[] | undefined;

  if (query.occupantCounts || query.minOccupants || query.maxOccupants) {
    const tenantIdsWithOccupantCount = await prisma.tenant.findMany({
      select: {
        id: true,
        occupants: {
          select: {
            id: true,
          },
        },
      },
    });

    // Filter tenant IDs based on occupant count
    occupantFilteredTenantIds = tenantIdsWithOccupantCount
      .filter((tenant) => {
        const totalPeople = tenant.occupants.length;

        if (query.occupantCounts) {
          return totalPeople === parseInt(query.occupantCounts);
        }

        if (query.minOccupants && query.maxOccupants) {
          return (
            totalPeople >= parseInt(query.minOccupants) &&
            totalPeople <= parseInt(query.maxOccupants)
          );
        }

        if (query.minOccupants) {
          return totalPeople >= parseInt(query.minOccupants);
        }

        if (query.maxOccupants) {
          return totalPeople <= parseInt(query.maxOccupants);
        }

        return false;
      })
      .map((tenant) => tenant.id);

    if (occupantFilteredTenantIds.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          currentPage: page,
          lastPage: 0,
          perPage: limit,
        },
      };
    }

    // Add occupant filter to where clause
    whereClause.id = {
      in: occupantFilteredTenantIds,
    };
  }

  const [tenants, totalCount] = await Promise.all([
    prisma.tenant.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        occupants: true,
        contract: {
          include: {
            contractType: true,
          },
        },
      },
    }),
    prisma.tenant.count({
      where: whereClause,
    }),
  ]);

  if (tenants.length === 0) {
    throw new NotFoundError('No tenants found');
  }
  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: tenants,
    ...paginationData,
  };
}
