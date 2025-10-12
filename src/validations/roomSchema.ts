import z from 'zod';
import { RoomStatus } from '../../generated/prisma';
import {  PaginationQuerySchema } from './paginationSchema';

//Add Room ID Schema (for param validation)
export const RoomIdSchema = z.object({
  roomId: z.uuid({ version: 'v4' }),
});

export const CreateRoomSchema = z.object({
  room_no: z.number().int().min(1, 'Room number is required and choose a positive number in the list'),
  floor: z.number().int(),
  dimension: z.string(),
  no_of_bed_room: z.number().int().min(1, 'Number of bedrooms is required and must be at least 1'),
  status: z.enum(
    RoomStatus,
    'Status must be one of Available, Rented, Purchased, InMaintenance'
  ),
  selling_price: z.number().optional(), // Prisma Decimal maps to number in TS
  max_no_of_people: z
    .number()
    .int()
    .min(1, 'Maximum number of people is required and must be at least 1'),
  description: z.string().optional().nullable(),

  //Relations
  tenant_id: z.uuid({ version: 'v4' }).optional().nullable(),
  bill_id: z.uuid({ version: 'v4' }).optional().nullable(),
  customer_service_id: z.uuid({ version: 'v4' }).optional().nullable(),
});

export const UpdateRoomSchema = z
  .object({
    room_no: z.number().int().optional(),
    floor: z.number().int().optional(),
    dimension: z.string().optional(),
    no_of_bed_room: z.number().int().optional(),
    status: z.enum(RoomStatus).optional(),
    selling_price: z.number().optional(), // Prisma Decimal maps to number in TS
    max_no_of_people: z.number().int().optional(),
    description: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be updated',
  });

//Add Query Schema (for filtering and pagination)
export const GetAllRoomsQuerySchema = PaginationQuerySchema.extend({
  room_no: z.string().optional(),
  floor: z.number().int().optional(),
  status: z
    .enum(
      RoomStatus,
      "Room Status must be one of 'Available', 'Rented', 'Purchased', 'InMaintenance"
    )
    .optional(),
  is_active: z
    .string()
    .refine((val) => val === 'true' || val === 'false', {
      message: 'is_active must be either "true" or "false"',
    })
    .transform((val) => val === 'true')
    .optional(),
});
//Type inference
export type CreateRoomType = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomType = z.infer<typeof UpdateRoomSchema>;
export type RoomIdType = z.infer<typeof RoomIdSchema>;
export type GetAllRoomsQueryType = z.infer<typeof GetAllRoomsQuerySchema>;