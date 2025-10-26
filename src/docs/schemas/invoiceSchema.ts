/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: d44605d3-4f8e-4057-b778-201111db860d
 *         status:
 *           type: string
 *           enum: ['Paid', 'Pending', 'Overdue']
 *           example: Paid
 *         billId:
 *           type: string
 *           format: uuid
 *           example: 201111db86-4f8e-4057-b778-0dd44605d3
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T04:07:20.031Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-15T10:59:20.031Z
 *         receiptSent:
 *           type: boolean
 *           example: false
 *         invoiceNo:
 *           type: string
 *           example: INV-D96A5423
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Invoice'
 *         - type: object
 *           properties:
 *             tenantName:
 *               type: string
 *               example: Daryl Murray
 *             roomNo:
 *               type: integer
 *               example: 316
 *             totalAmount:
 *               type: string
 *               example: "317550"
 *             billDueDate:
 *               type: string
 *               format: date-time
 *               example: 2024-10-13T10:46:15.559Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceById:
 *       allOf:
 *         - $ref: '#/components/schemas/Invoice'
 *         - type: object
 *           properties:
 *             receipt:
 *               type: object
 *               properties:
 *                 paymentMethod:
 *                   type: string
 *                   example: Cash
 *                 paidDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *             bill:
 *               $ref: '#/components/schemas/Bill'
 *             tenantName:
 *               type: string
 *               example: Sandy Corkery-Bayer
 *             roomNo:
 *               type: integer
 *               example: 101
 *             contractTypeName:
 *               type: string
 *               example: 12 Months
 *
 */
