/**
 * @swagger
 * components:
 *   responses:
 *     CreateReceiptSuccess:
 *       description: Receipt created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipt created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Receipt'
 *                           - type: object
 *                             properties:
 *                               invoice:
 *                                  $ref: '#/components/schemas/Invoice'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetReceiptSuccess:
 *       description: Receipt fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipt fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Receipt'
 *                           - type: object
 *                             properties:
 *                               invoice:
 *                                 $ref: '#/components/schemas/Invoice'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetReceiptByInvoiceIdSuccess:
 *       description: Receipt By Invoice Id fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipt fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                          allOf:
 *                            - $ref: '#/components/schemas/Receipt'
 *                            - type: object
 *                              properties:
 *                                invoice:
 *                                  $ref: '#/components/schemas/Invoice'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateReceiptSuccess:
 *       description: Receipt updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipt updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       receipt:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Receipt'
 *                           - type: object
 *                             properties:
 *                               invoice:
 *                                 allOf:
 *                                   - $ref: '#/components/schemas/Invoice'
 *                                   - type: object
 *                                     properties:
 *                                       receiptSent:
 *                                         type: boolean
 *                                         example: false
 *                                       invoiceNo:
 *                                         type: string
 *                                         example: INV-D96A5423
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetLatestReceiptSuccess:
 *       description: Latest receipt fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Latest receipts by tenant id fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         allOf:
 *                             - $ref: '#/components/schemas/Receipt'
 *                             - type: object
 *                               properties:
 *                                 invoiceId:
 *                                   type: string
 *                                   format: uuid
 */

/**
 * @swagger
 * components:
 *   responses:
 *     ReceiptHistorySuccess:
 *       description: Receipt history fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipt histories by tenant id fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           allOf:
 *                             - $ref: '#/components/schemas/Receipt'
 *                             - type: object
 *                               properties:
 *                                 invoiceId:
 *                                   type: string
 *                                   format: uuid
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     SendReceiptEmailSuccess:
 *       description: Receipt sent successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipt sent successfully
 */
