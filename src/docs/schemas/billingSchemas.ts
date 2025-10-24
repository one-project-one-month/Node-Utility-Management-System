/**
 * @swagger
 * components:
 *   schemas:
 *     Bill:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: d44605d3-4f8e-4057-b778-201111db860d
 *         rentalFee:
 *           type: number
 *           example: 1200000
 *         electricityFee:
 *           type: number
 *           example: 15000
 *         waterFee:
 *           type: number
 *           example: 8000
 *         fineFee:
 *           type: number
 *           example: 0
 *         serviceFee:
 *           type: number
 *           example: 3000
 *         groundFee:
 *           type: number
 *           example: 1000
 *         carParkingFee:
 *           type: number
 *           example: 2000
 *         wifiFee:
 *           type: number
 *           example: 1500
 *         totalAmount:
 *           type: number
 *           example: 1229500
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: 2025-11-15T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-15T08:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-15T08:00:00.000Z
 *
 *     BillWithTenant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 'af09b965-a817-433c-8a7f-ce211dd31210'
 *         rentalFee:
 *           type: string
 *           example: '300000'
 *         electricityFee:
 *           type: string
 *           example: '44975'
 *         waterFee:
 *           type: string
 *           example: '8550'
 *         fineFee:
 *           type: string
 *           nullable: true
 *           example: null
 *         serviceFee:
 *           type: string
 *           example: '5000'
 *         groundFee:
 *           type: string
 *           example: '5000'
 *         carParkingFee:
 *           type: string
 *           nullable: true
 *           example: null
 *         wifiFee:
 *           type: string
 *           example: '10000'
 *         totalAmount:
 *           type: string
 *           example: '363525'
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: '2025-04-10T07:45:15.542Z'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2025-04-01T05:51:15.542Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2025-04-01T09:14:15.542Z'
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: '91c3dcfa-7826-41c7-b8d0-3e4f3735827a'
 *         room:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '91c3dcfa-7826-41c7-b8d0-3e4f3735827a'
 *             roomNo:
 *               type: integer
 *               example: 101
 *             floor:
 *               type: integer
 *               example: 1
 *             dimension:
 *               type: string
 *               example: '25x23 ft'
 *             noOfBedRoom:
 *               type: integer
 *               example: 3
 *             status:
 *               type: string
 *               example: 'Rented'
 *             sellingPrice:
 *               type: string
 *               nullable: true
 *               example: null
 *             maxNoOfPeople:
 *               type: integer
 *               example: 4
 *             description:
 *               type: string
 *               example: 'Spacious room with natural lighting'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-22T08:35:15.064Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-22T08:35:15.064Z'
 *             tenant:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: '6d744ea8-ff9d-4fac-85c1-3b5ac3a3fff6'
 *                 name:
 *                   type: string
 *                   example: 'Sandy Corkery-Bayer'
 *                 email:
 *                   type: string
 *                   example: 'sandy.corkery-bayer83@gmail.com'
 *                 nrc:
 *                   type: string
 *                   example: '5/ABCD(N)129013'
 *                 phoneNo:
 *                   type: string
 *                   example: '+959999650870'
 *                 emergencyNo:
 *                   type: string
 *                   example: '+959586250222'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-10-22T08:35:15.291Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-10-22T08:35:15.291Z'
 *                 roomId:
 *                   type: string
 *                   format: uuid
 *                   example: '91c3dcfa-7826-41c7-b8d0-3e4f3735827a'
 *         totalUnit:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: 'f7ef9d08-5ddf-4632-8a71-508807f0b86a'
 *             electricityUnits:
 *               type: string
 *               example: '128.5'
 *             waterUnits:
 *               type: string
 *               example: '57'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-04-01T05:51:15.542Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-04-01T04:37:15.542Z'
 *             billId:
 *               type: string
 *               format: uuid
 *               example: 'af09b965-a817-433c-8a7f-ce211dd31210'
 *         invoice:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '8b273544-6393-4cfd-911b-7d91d890ca7a'
 *             invoiceNo:
 *               type: string
 *               example: 'INV-HCI3NX9Y'
 *             status:
 *               type: string
 *               example: 'Paid'
 *             receiptSent:
 *               type: boolean
 *               example: false
 *             billId:
 *               type: string
 *               format: uuid
 *               example: 'af09b965-a817-433c-8a7f-ce211dd31210'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-04-04T05:51:15.542Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-04-04T03:51:15.542Z'
 *             receipt:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: '100e5e36-385c-4e5d-9834-284f8b4d12d8'
 *                 paymentMethod:
 *                   type: string
 *                   example: 'Mobile_Banking'
 *                 paidDate:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-04-09T08:29:15.542Z'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-04-09T08:29:15.542Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-04-10T10:53:15.542Z'
 *                 invoiceId:
 *                   type: string
 *                   format: uuid
 *                   example: '8b273544-6393-4cfd-911b-7d91d890ca7a'
 */
