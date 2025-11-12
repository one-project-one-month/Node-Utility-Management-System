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
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: 12 Months
 *                             tenantCount:
 *                               type: number
 *                               example: 18
 *                         example:
 *                           - contractType:
 *                               name: "12 Months"
 *                             tenantCount: 18
 *                           - contractType:
 *                               name: "24 Months"
 *                             tenantCount: 24
 *                           - contractType:
 *                               name: "6 Months"
 *                             tenantCount: 36
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

/**
 * @swagger
 * components:
 *   responses:
 *     CustomerServiceAnalyticsSuccess:
 *       description: Get analytic customer service count data sccessful.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Get analytic customer service count data sccessful.
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             countByStatus:
 *                               type: object
 *                               properties:
 *                                 pending:
 *                                   type: object
 *                                   properties:
 *                                     all:
 *                                       type: number
 *                                       example: 20
 *                                     high:
 *                                       type: number
 *                                       example: 2
 *                                     medium:
 *                                       type: number
 *                                       example: 7
 *                                     low:
 *                                       type: number
 *                                       example: 11
 */
