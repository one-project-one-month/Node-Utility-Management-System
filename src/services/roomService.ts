import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
  CreateRoomType,
  UpdateRoomType,
  GetAllRoomsQueryType,
  getRoomCountType,
} from '../validations/roomSchema';
import { Prisma } from '../../generated/prisma';
import { Request } from 'express';
import { generatePaginationData } from '../common/utils/paginationHelper';

export async function getAllRoomsService(req: Request) {
  const query = req.validatedQuery as GetAllRoomsQueryType;

  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.RoomWhereInput = {};

  // Optional filters
  if (query.status) whereClause.status = query.status;
  if (query.roomNo) whereClause.roomNo = Number(query.roomNo);
  if (query.floor) whereClause.floor = Number(query.floor);

  // Get rooms & totalCount with filters
  const [rooms, totalCount] = await prisma.$transaction([
    prisma.room.findMany({
      where: whereClause,
      include: {
        tenant: true,
        bill: true,
        customerService: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.room.count({ where: whereClause }),
  ]);

  if (rooms.length === 0) throw new NotFoundError('No rooms found');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: rooms,
    ...paginationData,
  };
}

export async function getRoomService(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      contract: true,
      bill: true,
      customerService: true,
      tenant: true,
    },
  });

  if (!room) throw new NotFoundError('Room not found');
  return room;
}

export async function createRoomService(data: CreateRoomType) {
  const existingRoom = await prisma.room.findFirst({
    where: { roomNo: data.roomNo, floor: data.floor },
  });

  if (existingRoom)
    throw new BadRequestError(
      'Room with this number already exists on this floor'
    );

  const room = await prisma.room.create({ data });
  return room;
}

export async function updateRoomService(roomId: string, data: UpdateRoomType) {
  const existingRoom = await prisma.room.findUnique({ where: { id: roomId } });
  if (!existingRoom) throw new NotFoundError('Room not found');

  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data,
  });
  return updatedRoom;
}

export async function getRoomCountService(req: Request) {
  const { status = 'Available' } = req.validatedQuery as getRoomCountType;

  const [allRoomsCount, roomStatusCount] = await prisma.$transaction([
    prisma.room.count(),
    prisma.room.count({ where: { status } }),
  ]);
  if (!allRoomsCount) {
    throw new NotFoundError('No room count found ');
  }
  if (!roomStatusCount) {
    throw new NotFoundError(`No room count found for this ${status} status`);
  }
  return { allRoomsCount, roomStatusCount };
}

// export async function deleteRoomService(roomId: string) {
//   const existingRoom = await prisma.room.findUnique({ where: { id: roomId } });
//   if (!existingRoom) throw new NotFoundError('Room not found');

//   const deletedRoom = await prisma.room.delete({ where: { id: roomId } });
//   return deletedRoom;
// }
