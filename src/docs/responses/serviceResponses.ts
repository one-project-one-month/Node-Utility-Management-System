/**
 * @swagger
 * components:
 *   responses:
 *     CreateServiceSuccess:
 *       description: Customer service created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     example: Customer service created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       service:
 *                         $ref: '#/components/schemas/CustomerService'
 *                   status:
 *                     type: integer
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetServiceSuccess:
 *       description: Customer service retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Fetch customer service by ID successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       service:
 *                         $ref: '#/components/schemas/CustomerService'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateServiceSuccess:
 *       description: Customer service updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     example: Customer service updated successfully
 *                   content:
 *                     properties:
 *                       service:
 *                         $ref: '#/components/schemas/CustomerService'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     DeleteServiceSuccess:
 *       description: Customer service deleted successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Customer service deleted successfully
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ServiceHistorySuccess:
 *       description: Customer service history retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Fetch service history successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/CustomerService'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 */
