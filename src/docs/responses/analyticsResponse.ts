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
