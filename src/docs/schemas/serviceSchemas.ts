/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 'c54e9b25-d17f-4c8f-9c73-15fd95a62f1f'
 *         description:
 *           type: string
 *           example: 'Light bulb in room 101 needs replacement.'
 *         category:
 *           type: string
 *           enum: [Complain, Maintenance, Other]
 *         status:
 *           type: string
 *           enum: [Pending, Ongoing, Resolved]
 *         priorityLevel:
 *           type: string
 *           enum: [Low, Medium, High]
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: 'b7a2cc9b-9f7b-46cf-b3f9-19cb94d68c73'
 *         roomNo:
 *           type: string
 *           example: '201'
 *         issuedDate:
 *           type: string
 *           example: '2025-10-05T07:15:00.000Z'
 *         createdAt:
 *           type: string
 *           example: '2025-10-05T07:15:00.000Z'
 *         updatedAt:
 *           type: string
 *           example: '2025-10-05T09:30:00.000Z'
 */
