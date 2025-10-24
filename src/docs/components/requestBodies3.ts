/**
 * @swagger
 * components:
 *   requestBodies:
 *     # Contract Type Management
 *     CreateContractTypeRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, duration, price, facilities]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: 'Standard 1-Year Lease'
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 12
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 1200000
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   minLength: 1
 *                 minItems: 1
 *                 example: ['WiFi', 'Parking', 'Maintenance']
 *
 *     UpdateContractTypeRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: 'Premium 2-Year Lease'
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 24
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 2200000
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   minLength: 1
 *                 example: ['WiFi', 'Parking', 'Maintenance', 'Gym Access']
 *
 *     # Room Management
 *     CreateRoomRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomNo, floor, dimension, noOfBedRoom, status, maxNoOfPeople]
 *             properties:
 *               roomNo:
 *                 type: integer
 *                 minimum: 1
 *                 example: 414
 *               floor:
 *                 type: integer
 *                 example: 4
 *               dimension:
 *                 type: string
 *                 example: 14x20 ft
 *               noOfBedRoom:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [Available, Rented, Maintenance]
 *                 example: Available
 *               sellingPrice:
 *                 type: number
 *                 example: 1352275
 *               maxNoOfPeople:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: City view with balcony
 *               tenantId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               billId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               customerServiceId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *
 *     UpdateRoomRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomNo:
 *                 type: integer
 *                 minimum: 1
 *                 example: 415
 *               floor:
 *                 type: integer
 *                 example: 4
 *               dimension:
 *                 type: string
 *                 example: 15x20 ft
 *               noOfBedRoom:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               status:
 *                 type: string
 *                 enum: [Available, Rented, Maintenance]
 *                 example: Rented
 *               sellingPrice:
 *                 type: number
 *                 example: 1400000
 *               maxNoOfPeople:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               description:
 *                 type: string
 *                 example: City view with large balcony
 *
 *     # Bill Management
 *     CreateBillRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: d44605d3-4f8e-4057-b778-201111db860d
 *               rentalFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 1200000
 *               electricityFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 15000
 *               waterFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 8000
 *               fineFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 0
 *               serviceFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 3000
 *               groundFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 1000
 *               carParkingFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 2000
 *               wifiFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 1500
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *                 example: 1229500
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-15T00:00:00.000Z
 *
 *     UpdateBillRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: d44605d3-4f8e-4057-b778-201111db860d
 *               rentalFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 1250000
 *               electricityFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 16000
 *               waterFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 8500
 *               fineFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 500
 *               serviceFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 3500
 *               groundFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 1200
 *               carParkingFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 2500
 *               wifiFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 1800
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *                 example: 1285000
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-20T00:00:00.000Z
 *
 *     # Invoice Management
 *     CreateInvoiceRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [billId, status]
 *             properties:
 *               billId:
 *                 type: string
 *                 format: uuid
 *                 example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *               status:
 *                 type: string
 *                 enum: [Paid, Pending, Overdue]
 *                 example: Pending
 *
 *     UpdateInvoiceRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Paid, Pending, Overdue]
 *                 example: Paid
 *               receiptSent:
 *                 type: boolean
 *                 example: true
 */
