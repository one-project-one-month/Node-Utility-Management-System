import { Router } from 'express';
import {
  getAllRoomsController,
  getRoomController,
  createRoomController,
  updateRoomController,
  deleteRoomController,
} from '../controllers/RoomController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddlware'; 

import {
  CreateRoomSchema,
  UpdateRoomSchema,
  RoomIdSchema,
  GetAllRoomSchema,
} from '../validations/roomSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/create',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateRoomSchema),
  createRoomController
);

router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllRoomSchema),
  getAllRoomsController
);

router.get(
  '/:id', //matches controller param
  hasRole(['Admin', 'Staff']),
  validateRequestParams(RoomIdSchema),
  getRoomController
);

router.put(
  '/:id',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(RoomIdSchema),
  validateRequestBody(UpdateRoomSchema),
  updateRoomController
);

router.delete(
  '/:id',
  hasRole(['Admin']),
  validateRequestParams(RoomIdSchema),
  deleteRoomController
);

export default router;
