/**
 * @swagger
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 7fc98505-605f-49d2-a3b8-3c6f6eac0ad2
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Mobile Banking]
 *           example: Cash
 *         paidDate:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T04:07:20.031Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-14T04:07:20.031Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-15T10:59:20.031Z
 */
