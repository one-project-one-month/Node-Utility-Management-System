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
