/**
 * @swagger
 * components:
 *   requestBodies:
 *     # Receipt Management
 *     CreateReceiptRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod, paidDate, invoiceId]
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, Mobile Banking]
 *                 example: Cash
 *               paidDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-14T04:07:20.031Z
 *               invoiceId:
 *                 type: string
 *                 format: uuid
 *                 example: d1ea2e8f-c047-48e0-bd90-d26356674d47
 *
 *     UpdateReceiptRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, Mobile Banking]
 *                 example: Mobile Banking
 *               paidDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-14T04:07:20.031Z
 *
 *     SendReceiptRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiptId, email]
 *             properties:
 *               receiptId:
 *                 type: string
 *                 format: uuid
 *                 example: 7fc98505-605f-49d2-a3b8-3c6f6eac0ad2
 *               email:
 *                 type: string
 *                 format: email
 *                 example: tenant@gmail.com
 *
 *     # Total Units Management
 *     CreateTotalUnitsRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [electricityUnits, waterUnits, billId]
 *             properties:
 *               electricityUnits:
 *                 type: number
 *                 minimum: 0.1
 *                 description: Electricity consumption in units (must be positive)
 *                 example: 125.5
 *               waterUnits:
 *                 type: number
 *                 minimum: 0.1
 *                 description: Water consumption in units (must be positive)
 *                 example: 45.2
 *               billId:
 *                 type: string
 *                 format: uuid
 *                 description: Associated bill ID
 *                 example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *
 *     UpdateTotalUnitsRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               electricityUnits:
 *                 type: number
 *                 minimum: 0.1
 *                 description: Electricity consumption in units (must be positive)
 *                 example: 130.8
 *               waterUnits:
 *                 type: number
 *                 minimum: 0.1
 *                 description: Water consumption in units (must be positive)
 *                 example: 48.5
 *               billId:
 *                 type: string
 *                 format: uuid
 *                 description: Associated bill ID
 *                 example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *
 *     # Contract Management
 *     CreateContractRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomId, contractTypeId, tenantId, createdDate, expiryDate]
 *             properties:
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: d44605d3-4f8e-4057-b778-201111db860d
 *               contractTypeId:
 *                 type: string
 *                 format: uuid
 *                 example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *               tenantId:
 *                 type: string
 *                 format: uuid
 *                 example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *               createdDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-01T00:00:00.000Z
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-01T00:00:00.000Z
 *               updatedDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-01T00:00:00.000Z
 *
 *     UpdateContractRequest:
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
 *               contractTypeId:
 *                 type: string
 *                 format: uuid
 *                 example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *               tenantId:
 *                 type: string
 *                 format: uuid
 *                 example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *               createdDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-01T00:00:00.000Z
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-01T00:00:00.000Z
 *               updatedDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-01T00:00:00.000Z
 */
