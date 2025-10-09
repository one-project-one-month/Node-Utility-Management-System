import { Request, Response, NextFunction } from 'express';
import {
  getAllRoomsService,
  getRoomService,
  createRoomService,
  updateRoomService,
  deleteRoomService,
} from '../services/roomService';
import { successResponse } from '../common/apiResponse';
import { BadRequestError } from '../common/errors';

// Get all rooms
export async function getAllRoomsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getAllRoomsService(req.query);
    successResponse(res, 'Rooms fetched successfully', result);
  } catch (error) {
    next(error);
  }
}

// Get single room
export async function getRoomController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError('Room ID is required');

    const room = await getRoomService(id);
    successResponse(res, 'Room fetched successfully', room);
  } catch (error) {
    next(error);
  }
}

// Create room
export async function createRoomController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const room = await createRoomService(req.body);
    successResponse(res, 'Room created successfully', room);
  } catch (error) {
    next(error);
  }
}

// Update room
export async function updateRoomController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError('Room ID is required');

    const updatedRoom = await updateRoomService(id, req.body);
    successResponse(res, 'Room updated successfully', updatedRoom);
  } catch (error) {
    next(error);
  }
}

// Delete room
export async function deleteRoomController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError('Room ID is required');

    const deletedRoom = await deleteRoomService(id);
    successResponse(res, 'Room deleted successfully', deletedRoom);
  } catch (error) {
    next(error);
  }
}
