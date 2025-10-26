/**
 * @swagger
 * components:
 *   schemas:
 *     AdminUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 974cbaf3-78b9-41f0-b6e9-8a9ddf9682d3
 *         userName:
 *           type: string
 *           example: admin
 *         email:
 *           type: string
 *           example: admin@gmail.com
 *         role:
 *           type: string
 *           example: Admin
 *         tenantId:
 *           type: string
 *           nullable: true
 *           example:
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           example: 2025-09-30T18:05:15.112Z
 *         updatedAt:
 *           type: string
 *           example: 2025-10-01T03:25:04.296Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TenantUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 974cbaf3-78b9-41f0-b6e9-8a9ddf9682d3
 *         userName:
 *           type: string
 *           example: tenant1
 *         email:
 *           type: string
 *           example: tenant1@gmail.com
 *         role:
 *           type: string
 *           example: Tenant
 *         tenantId:
 *           type: string
 *           nullable: true
 *           example: null
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           example: 2025-09-30T18:05:15.112Z
 *         updatedAt:
 *           type: string
 *           example: 2025-10-01T03:25:04.296Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [Admin, Staff, Tenant]
 *       example: Tenant
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithTenant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 83d2b530-8c34-43ad-bc71-e52e694037c7
 *         userName:
 *           type: string
 *           example: forrest73
 *         email:
 *           type: string
 *           example: forrest.bechtelar87@gmail.com
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         tenantId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: ea15ed0c-2c32-439c-91e7-1e377044a3ef
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-22T08:35:15.493Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-22T08:35:15.493Z
 *         tenant:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: ea15ed0c-2c32-439c-91e7-1e377044a3ef
 *             name:
 *               type: string
 *               example: John Doe Updated
 *             roomId:
 *               type: string
 *               format: uuid
 *               example: ecc866a2-69ea-4a92-a247-60dbe4962b37
 *             room:
 *               type: object
 *               properties:
 *                 roomNo:
 *                   type: integer
 *                   example: 103
 *                 floor:
 *                   type: integer
 *                   example: 1
 */
