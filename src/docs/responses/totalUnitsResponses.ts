/**
 * @swagger
 * components:
 *   responses:
 *     CreateTotalUnitsSuccess:
 *       description: Total units created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Total-units created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/TotalUnits'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetTotalUnitsSuccess:
 *       description: Total units fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Total-units by id fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/TotalUnits'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateTotalUnitsSuccess:
 *       description: Total units updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Total-units updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/TotalUnits'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetTotalUnitsByBillSuccess:
 *       description: Total units fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Total-units by bill id fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/TotalUnits'
 */
