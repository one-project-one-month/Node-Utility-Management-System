/**
 * @swagger
 * components:
 *   responses:
 *     CreateRoomSuccess:
 *       description: Room created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Room created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Room'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetRoomSuccess:
 *       description: Room fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Room fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/RoomWithRelationships'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateRoomSuccess:
 *       description: Room updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Room updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Room'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetRoomCountSuccess:
 *       description: Get total room and avaliable room count successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Get total room and avaliable room count successfully.
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: object
 *                         properties:
 *                           allRoomsCount:
 *                             type: number
 *                             example: 100
 *                           roomStatusCount:
 *                             type: number
 *                             example: 50
 */
