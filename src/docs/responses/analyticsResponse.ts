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

/**
 * @swagger
 * components:
 *   responses:
 *     BillStatusAnalyticsSuccess:
 *       description: Bill analytics fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bill analytics fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "2025-2"
 *                           pending:
 *                             type: number
 *                             example: 1230606
 *                           paid:
 *                             type: number
 *                             example: 13771792
 *                           overdue:
 *                             type: number
 *                             example: 1294122
 */

/**
 * @swagger
 * components:
 *   responses:
 *     BillRevenueAnalyticsSuccess:
 *       description: Bill revenue fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bill revenue fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: object
 *                         properties:
 *                           "2025-08":
 *                             type: number
 *                             example: 27202453
 *                           "2025-09":
 *                             type: number
 *                             example: 27175065
 *                           "2025-10":
 *                             type: number
 *                             example: 27198339
 *                           "2025-11":
 *                             type: number
 *                             example: 27354706
 *
 */
