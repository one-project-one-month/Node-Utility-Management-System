/**
 * @swagger
 * components:
 *   responses:
 *     GetTenantSuccess:
 *       description: Tenant retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Tenant gets successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       tenant:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Tenant'
 *                           - type: object
 *                             properties:
 *                               room:
 *                                 type: object
 *                                 $ref: '#/components/schemas/Room'
 *                               occupants:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Occupant'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CreateTenantSuccess:
 *       description: Tenant created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Tenant created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       tenant:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Tenant'
 *                           - type: object
 *                             properties:
 *                               room:
 *                                 type: object
 *                                 $ref: '#/components/schemas/Room'
 *                               occupants:
 *                                 type: array
 *                                 example: []
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateTenantSuccess:
 *       description: Tenant updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Tenants updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       tenant:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Tenant'
 *                           - type: object
 *                             properties:
 *                               room:
 *                                 type: object
 *                                 $ref: '#/components/schemas/Room'
 *                               occupants:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Occupant'
 */
