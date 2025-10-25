/**
 * @swagger
 * components:
 *   responses:
 *     GetOccupantSuccess:
 *       description: Occupant retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Occupant gets successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       occupant:
 *                         $ref: '#/components/schemas/Occupant'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CreateOccupantSuccess:
 *       description: Occupant(s) created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Occupant created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       occupant:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Occupant'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateOccupantSuccess:
 *       description: Occupant updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Occupant updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       occupant:
 *                         $ref: '#/components/schemas/Occupant'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     DeleteOccupantSuccess:
 *       description: Occupant deleted successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Occupant deleted successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       occupant:
 *                         $ref: '#/components/schemas/Occupant'
 */
