import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { CreateRoomType, UpdateRoomType } from '../validations/roomSchema';
import { Prisma } from '../../generated/prisma';

export async function getAllRoomsService(query: any) {
  const whereClause: Prisma.RoomWhereInput = {};

  // Optional filters
  if (query.status) whereClause.status = query.status;
  if (query.floor) whereClause.floor = Number(query.floor);

  // Pagination
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.room.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / limit);

  const rooms = await prisma.room.findMany({
    where: whereClause,
    include: {
      tenant: true,
      contract: true,
      bill: true,
      customer_service: true,
    },
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  return {
    rooms,
    pagination: {
      count: rooms.length,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      page,
      limit,
      totalPages,
      totalCount,
    },
  };
}

export async function getRoomService(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      tenant: true,
      contract: true,
      bill: true,
      customer_service: true,
    },
  });

  if (!room) throw new NotFoundError('Room not found');
  return room;
}

export async function createRoomService(data: CreateRoomType) {
  const existingRoom = await prisma.room.findFirst({
    where: { room_no: data.room_no, floor: data.floor }, // ✅ fixed uniqueness
  });

  if (existingRoom) throw new BadRequestError('Room with this number already exists on this floor');

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

export async function deleteRoomService(roomId: string) {
  const existingRoom = await prisma.room.findUnique({ where: { id: roomId } });
  if (!existingRoom) throw new NotFoundError('Room not found');

  const deletedRoom = await prisma.room.delete({ where: { id: roomId } });
  return deletedRoom;
}
