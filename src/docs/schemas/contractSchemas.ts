/**
 * @swagger
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 456e7890-f12a-34b5-c678-426614174000
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: d44605d3-4f8e-4057-b778-201111db860d
 *         contractTypeId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *         createdDate:
 *           type: string
 *           format: date-time
 *           example: 2025-10-01T00:00:00.000Z
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           example: 2026-09-30T00:00:00.000Z
 *         updatedDate:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         contractType:
 *           $ref: '#/components/schemas/ContractType'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContractType:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *         name:
 *           type: string
 *           example: 'Standard 1-Year Lease'
 *         duration:
 *           type: integer
 *           example: 12
 *         price:
 *           type: number
 *           example: 1200000
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *           example: ['WiFi', 'Parking', 'Maintenance']
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-01T00:00:00.000Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContractWithoutContractType:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 456e7890-f12a-34b5-c678-426614174000
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: d44605d3-4f8e-4057-b778-201111db860d
 *         contractTypeId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *         createdDate:
 *           type: string
 *           format: date-time
 *           example: 2025-10-01T00:00:00.000Z
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           example: 2026-09-30T00:00:00.000Z
 *         updatedDate:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 */
