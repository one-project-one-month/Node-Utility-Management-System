/**
 * @swagger
 * components:
 *   responses:
 *     CreateInvoiceSuccess:
 *       description: Invoice created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Invoice created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       invoice:
 *                         $ref: '#/components/schemas/Invoice'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetInvoiceSuccess:
 *       description: Invoice retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Invoice retrieved successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       invoice:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Invoice'
 *                           - type: object
 *                             properties:
 *                               receipt:
 *                                 type: object
 *                                 properties:
 *                                   paymentMethod:
 *                                     type: string
 *                                     example: Cash
 *                                   paidDate:
 *                                     type: string
 *                                     example: 2025-10-14T04:07:20.031Z
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateInvoiceSuccess:
 *       description: Invoice updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Invoice updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       invoice:
 *                         $ref: '#/components/schemas/Invoice'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetLatestInvoiceSuccess:
 *       description: Latest invoice retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Latest invoice retrieved successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       invoice:
 *                         $ref: '#/components/schemas/Invoice'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     InvoiceHistorySuccess:
 *       description: Invoice history retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Invoice fetched successfully.
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Invoice'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 */
