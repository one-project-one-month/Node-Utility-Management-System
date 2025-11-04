import { Request, Response, NextFunction } from 'express';
import {
  getAllRoomsService,
  getRoomService,
  createRoomService,
  updateRoomService,
  getRoomCountService,
  // deleteRoomService,
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
    const result = await getAllRoomsService(req);
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
    const { roomId } = req.validatedParams;
    if (!roomId) return next(new BadRequestError(' Room ID is required'));

    const room = await getRoomService(roomId);
    successResponse(res, 'Room fetched successfully', { data: room });
  } catch (error) {
    return next(error);
  }
}

// Create room
export async function createRoomController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const room = await createRoomService(req.validatedBody);
    successResponse(res, 'Room created successfully', { data: room });
  } catch (error) {
    return next(error);
  }
}

// Update room
export async function updateRoomController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { roomId } = req.validatedParams;
    if (!roomId) return next(new BadRequestError(' Room ID is required'));

    const updatedRoom = await updateRoomService(roomId, req.validatedBody);
    successResponse(res, 'Room updated successfully', { data: updatedRoom });
  } catch (error) {
    return next(error);
  }
}

//get total room and avaliabe room count
export async function getRoomCountController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const totalCount = await getRoomCountService();
    successResponse(
      res,
      'Get total room and avaliable room count successfully.',
      { data: totalCount }
    );
  } catch (error) {
    next(error);
  }
}

// export async function deleteRoomController(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const { id } = req.validatedParams;
//     if (!id) throw new BadRequestError('Valid Room ID is required');

//     const deletedRoom = await deleteRoomService(id);
//     successResponse(res, 'Room deleted successfully', deletedRoom);
//   } catch (error) {
//     next(error);
//   }
// }
