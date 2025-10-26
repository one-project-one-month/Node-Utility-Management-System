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
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BillWithTenant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 'fc917030-c0c8-47dd-a88e-1a04e0d8cc57'
 *         rentalFee:
 *           type: string
 *           example: '300000'
 *         electricityFee:
 *           type: string
 *           example: '18162'
 *         waterFee:
 *           type: string
 *           example: '8600'
 *         fineFee:
 *           type: string
 *           example: '1580'
 *         serviceFee:
 *           type: string
 *           example: '4386'
 *         groundFee:
 *           type: string
 *           example: '1002'
 *         carParkingFee:
 *           type: string
 *           example: '1038'
 *         wifiFee:
 *           type: string
 *           example: '1155'
 *         totalAmount:
 *           type: string
 *           example: '335923'
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: '2025-10-22T16:32:09.653Z'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2025-10-24T16:32:09.654Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2025-10-24T16:32:09.654Z'
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *         room:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *             roomNo:
 *               type: integer
 *               example: 517
 *             floor:
 *               type: integer
 *               example: 5
 *             dimension:
 *               type: string
 *               example: '23x25 ft'
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
 *               example: 2
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
 *                   example: 'c25d41d2-7b6e-4e82-aa2c-ab58f3c9a068'
 *                 name:
 *                   type: string
 *                   example: 'Clara Altenwerth'
 *                 email:
 *                   type: string
 *                   example: 'clara.altenwerth74@gmail.com'
 *                 nrc:
 *                   type: string
 *                   example: '15/ABCD(N)647139'
 *                 phoneNo:
 *                   type: string
 *                   example: '+959226610308'
 *                 emergencyNo:
 *                   type: string
 *                   example: '+959051632519'
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
 *                   example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *             contract:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: 'afcf6fdd-39f5-457a-bccb-570eaa068455'
 *                   expiryDate:
 *                     type: string
 *                     format: date-time
 *                     example: '2026-07-28T05:02:15.526Z'
 *                   createdDate:
 *                     type: string
 *                     format: date-time
 *                     example: '2025-07-28T05:02:15.526Z'
 *                   updatedDate:
 *                     type: string
 *                     format: date-time
 *                     example: '2025-07-31T03:16:15.526Z'
 *                   roomId:
 *                     type: string
 *                     format: uuid
 *                     example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *                   tenantId:
 *                     type: string
 *                     format: uuid
 *                     example: 'c25d41d2-7b6e-4e82-aa2c-ab58f3c9a068'
 *                   contractTypeId:
 *                     type: string
 *                     format: uuid
 *                     example: 'ed0097d0-f4f9-4889-8311-746fe4d9fbbf'
 *                   contractType:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 'ed0097d0-f4f9-4889-8311-746fe4d9fbbf'
 *                       name:
 *                         type: string
 *                         example: '12 Months'
 *                       duration:
 *                         type: integer
 *                         example: 12
 *                       price:
 *                         type: string
 *                         example: '300000'
 *                       facilities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ['WiFi', 'Water', 'Electricity', 'Security', 'Parking', 'Cleaning']
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2025-10-22T08:35:15.055Z'
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2025-10-22T08:35:15.055Z'
 *         totalUnit:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: 'a634f151-3834-47f1-849a-a704d552d960'
 *             electricityUnits:
 *               type: string
 *               example: '36.32'
 *             waterUnits:
 *               type: string
 *               example: '28.67'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.663Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.663Z'
 *             billId:
 *               type: string
 *               format: uuid
 *               example: 'fc917030-c0c8-47dd-a88e-1a04e0d8cc57'
 *         invoice:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '8b19e41f-f99c-4e64-b3e3-6640b887c2ce'
 *             invoiceNo:
 *               type: string
 *               example: 'INV-9A5A1F4B'
 *             status:
 *               type: string
 *               example: 'Pending'
 *             receiptSent:
 *               type: boolean
 *               example: false
 *             billId:
 *               type: string
 *               format: uuid
 *               example: 'fc917030-c0c8-47dd-a88e-1a04e0d8cc57'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.669Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.669Z'
 *             receipt:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: '6037565d-7233-491b-a63e-6c16b4ee9869'
 *                 paymentMethod:
 *                   type: string
 *                   example: 'Cash'
 *                 paidDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-10-24T16:32:09.669Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-10-24T16:32:09.669Z'
 *                 invoiceId:
 *                   type: string
 *                   format: uuid
 *                   example: '8b19e41f-f99c-4e64-b3e3-6640b887c2ce'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BillWithTenantId:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 'fc917030-c0c8-47dd-a88e-1a04e0d8cc57'
 *         rentalFee:
 *           type: string
 *           example: '300000'
 *         electricityFee:
 *           type: string
 *           example: '18162'
 *         waterFee:
 *           type: string
 *           example: '8600'
 *         fineFee:
 *           type: string
 *           example: '1580'
 *         serviceFee:
 *           type: string
 *           example: '4386'
 *         groundFee:
 *           type: string
 *           example: '1002'
 *         carParkingFee:
 *           type: string
 *           example: '1038'
 *         wifiFee:
 *           type: string
 *           example: '1155'
 *         totalAmount:
 *           type: string
 *           example: '335923'
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: '2025-10-22T16:32:09.653Z'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2025-10-24T16:32:09.654Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2025-10-24T16:32:09.654Z'
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *         room:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *             roomNo:
 *               type: integer
 *               example: 517
 *             floor:
 *               type: integer
 *               example: 5
 *             dimension:
 *               type: string
 *               example: '23x25 ft'
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
 *               example: 2
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
 *                   example: 'c25d41d2-7b6e-4e82-aa2c-ab58f3c9a068'
 *                 name:
 *                   type: string
 *                   example: 'Clara Altenwerth'
 *                 email:
 *                   type: string
 *                   example: 'clara.altenwerth74@gmail.com'
 *                 nrc:
 *                   type: string
 *                   example: '15/ABCD(N)647139'
 *                 phoneNo:
 *                   type: string
 *                   example: '+959226610308'
 *                 emergencyNo:
 *                   type: string
 *                   example: '+959051632519'
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
 *                   example: '7203a342-7f84-4beb-b9bc-ef423c443dbe'
 *         totalUnit:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: 'a634f151-3834-47f1-849a-a704d552d960'
 *             electricityUnits:
 *               type: string
 *               example: '36.32'
 *             waterUnits:
 *               type: string
 *               example: '28.67'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.663Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.663Z'
 *             billId:
 *               type: string
 *               format: uuid
 *               example: 'fc917030-c0c8-47dd-a88e-1a04e0d8cc57'
 *         invoice:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '8b19e41f-f99c-4e64-b3e3-6640b887c2ce'
 *             invoiceNo:
 *               type: string
 *               example: 'INV-9A5A1F4B'
 *             status:
 *               type: string
 *               example: 'Pending'
 *             receiptSent:
 *               type: boolean
 *               example: false
 *             billId:
 *               type: string
 *               format: uuid
 *               example: 'fc917030-c0c8-47dd-a88e-1a04e0d8cc57'
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.669Z'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: '2025-10-24T16:32:09.669Z'
 *             receipt:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: '6037565d-7233-491b-a63e-6c16b4ee9869'
 *                 paymentMethod:
 *                   type: string
 *                   example: 'Cash'
 *                 paidDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-10-24T16:32:09.669Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-10-24T16:32:09.669Z'
 *                 invoiceId:
 *                   type: string
 *                   format: uuid
 *                   example: '8b19e41f-f99c-4e64-b3e3-6640b887c2ce'
 */
