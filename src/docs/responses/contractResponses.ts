/**
 * @swagger
 * components:
 *   responses:
 *     CreateContractSuccess:
 *       description: Contract created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contract:
 *                         $ref: '#/components/schemas/Contract'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateContractSuccess:
 *       description: Contract updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contract:
 *                         $ref: '#/components/schemas/Contract'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetContractSuccess:
 *       description: Contract fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contract:
 *                         $ref: '#/components/schemas/Contract'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetContractByTenantSuccess:
 *       description: Contracts fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: All Contracts fetched By tenantId successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contract:
 *                         $ref: '#/components/schemas/Contract'
 */
