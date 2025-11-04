import { Router } from 'express';
import {
  getAllRoomsController,
  getRoomController,
  createRoomController,
  updateRoomController,
  getRoomCountController,
  // deleteRoomController,
} from '../controllers/roomController';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../middlewares/validationMiddleware';
import {
  CreateRoomSchema,
  UpdateRoomSchema,
  RoomIdSchema,
  GetAllRoomsQuerySchema,
} from '../validations/roomSchema';
import { hasRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/v1/rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Create a new room (Admin & Staff only)
 *     description: Create a new room with room details. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateRoomRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateRoomSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestBody(CreateRoomSchema),
  createRoomController
);

// get total room and avaliable room count
router.get('/counts', hasRole(['Admin', 'Staff']), getRoomCountController);

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: Get all rooms (Admin & Staff only)
 *     description: Retrieves a list of all rooms with pagination and filtering support. Accessible only to Admin and Staff users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - name: roomNo
 *         in: query
 *         description: Filter by room number
 *         required: false
 *         schema:
 *           type: string
 *       - name: floor
 *         in: query
 *         description: Filter by floor number
 *         required: false
 *         schema:
 *           type: integer
 *       - $ref: '#/components/parameters/RoomStatusFilterParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaginatedRoomsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/',
  hasRole(['Admin', 'Staff']),
  validateRequestQuery(GetAllRoomsQuerySchema),
  getAllRoomsController
);

/**
 * @swagger
 * /api/v1/rooms/{roomId}:
 *   get:
 *     tags: [Rooms]
 *     summary: Get room by ID (Admin & Staff only)
 *     description: Retrieve a specific room by its ID with contract, bill, customer service, and tenant details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RoomIdParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetRoomSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:roomId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(RoomIdSchema),
  getRoomController
);

/**
 * @swagger
 * /api/v1/rooms/{roomId}:
 *   put:
 *     tags: [Rooms]
 *     summary: Update room by ID (Admin & Staff only)
 *     description: Update room information. At least one field must be provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RoomIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateRoomRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateRoomSuccess'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:roomId',
  hasRole(['Admin', 'Staff']),
  validateRequestParams(RoomIdSchema),
  validateRequestBody(UpdateRoomSchema),
  updateRoomController
);

// router.delete(
//   '/:roomId',
//   hasRole(['Admin']),
//   validateRequestParams(RoomIdSchema),
//   deleteRoomController
// );

export default router;
