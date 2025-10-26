/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: d44605d3-4f8e-4057-b778-201111db860d
 *         roomNo:
 *           type: integer
 *           example: 414
 *         floor:
 *           type: integer
 *           example: 4
 *         dimension:
 *           type: string
 *           example: 14x20 ft
 *         noOfBedRoom:
 *           type: integer
 *           example: 2
 *         status:
 *           type: string
 *           enum: [Available, Rented, Maintenance]
 *           example: Rented
 *         sellingPrice:
 *           type: string
 *           example: '1352275'
 *         maxNoOfPeople:
 *           type: integer
 *           example: 2
 *         description:
 *           type: string
 *           example: City view with balcony
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.158Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.158Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomWithRelationships:
 *       allOf:
 *         - $ref: '#/components/schemas/Room'
 *         - type: object
 *           properties:
 *             contract:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContractWithoutContractType'
 *             bill:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *             customerService:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerService'
 *             tenant:
 *               $ref: '#/components/schemas/Tenant'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomWithRelationshipsWithoutContract:
 *       allOf:
 *         - $ref: '#/components/schemas/Room'
 *         - type: object
 *           properties:
 *             bill:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *             customerService:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerService'
 *             tenant:
 *               $ref: '#/components/schemas/Tenant'
 */
