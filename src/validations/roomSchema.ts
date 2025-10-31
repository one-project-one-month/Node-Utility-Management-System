import z from 'zod';
import { RoomStatus } from '../../generated/prisma';
import { PaginationQuerySchema } from './paginationSchema';

//Add Room ID Schema (for param validation)
export const RoomIdSchema = z.object({
  roomId: z.uuid({ version: 'v4' }),
});

export const CreateRoomSchema = z.object({
  roomNo: z
    .int()
    .min(1, 'Room number is required and choose a positive number in the list'),
  floor: z.int(),
  dimension: z.string(),
  noOfBedRoom: z
    .int()
    .min(1, 'Number of bedrooms is required and must be at least 1'),
  status: z.enum(
    RoomStatus,
    'Status must be one of Available, Rented, Purchased, InMaintenance'
  ),
  sellingPrice: z.number().optional(), // Prisma Decimal maps to number in TS
  maxNoOfPeople: z
    .int()
    .min(1, 'Maximum number of people is required and must be at least 1'),
  description: z.string().optional().nullable(),
});

export const UpdateRoomSchema = z
  .object({
    roomNo: z.int().optional(),
    floor: z.int().optional(),
    dimension: z.string().optional(),
    noOfBedRoom: z.int().optional(),
    status: z.enum(RoomStatus).optional(),
    sellingPrice: z.number().optional(), // Prisma Decimal maps to number in TS
    maxNoOfPeople: z.int().optional(),
    description: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be updated',
  });

//Add Query Schema (for filtering and pagination)
export const GetAllRoomsQuerySchema = PaginationQuerySchema.extend({
  roomNo: z.string().optional(),
  floor: z.string().optional(),
  status: z
    .enum(
      RoomStatus,
      "Room Status must be one of 'Available', 'Rented', 'Purchased', 'InMaintenance"
    )
    .optional(),
});

//Type inference
export type CreateRoomType = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomType = z.infer<typeof UpdateRoomSchema>;
export type RoomIdType = z.infer<typeof RoomIdSchema>;
export type GetAllRoomsQueryType = z.infer<typeof GetAllRoomsQuerySchema>;
