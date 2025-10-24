/**
 * @swagger
 * components:
 *   responses:
 *     CreateBillSuccess:
 *       description: Bill created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bill created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Bill'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateBillSuccess:
 *       description: Bill updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bill updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/Bill'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetBillSuccess:
 *       description: Bill details retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bill details retrieved successfully
 *                   data:
 *                     $ref: '#/components/schemas/BillWithTenant'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     AutoGenerateBillsSuccess:
 *       description: Bills auto-generated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bills auto-generated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: string
 *                         example: Bill generated for 15 rooms and sent invoices via mail
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetLatestBillSuccess:
 *       description: Latest bill fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Latest Bill fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/BillWithTenant'
 */
