/**
 * @swagger
 * components:
 *   responses:
 *     ContractTypeAnalyticsSuccess:
 *       description: Contract type analytics fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract type analytics fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             contractType:
 *                               type: string
 *                               example: 12 Months
 *                             tenantCount:
 *                               type: number
 *                               example: 18
 *                         example:
 *                           - contractType: "6 Months"
 *                             tenantCount: 36
 *                           - contractType: "12 Months"
 *                             tenantCount: 18
 *                           - contractType: "24 Months"
 *                             tenantCount: 24

 */

/**
 * @swagger
 * components:
 *   responses:
 *     RoomAnalyticsSuccess:
 *       description: Room analytics fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Room analytics fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                               example: Available
 *                             count:
 *                               type: number
 *                               example: 10
 *                         example:
 *                           - status: "Available"
 *                             count: 10
 *                           - status: "Occupied"
 *                             count: 25
 *                           - status: "Maintenance"
 *                             count: 5
 */
