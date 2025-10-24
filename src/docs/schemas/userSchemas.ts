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
 *
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
 *           example: 8a9ddf9682d3-974cbaf3-78b9-41f0-b6e9
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           example: 2025-09-30T18:05:15.112Z
 *         updatedAt:
 *           type: string
 *           example: 2025-10-01T03:25:04.296Z
 *
 *     UserRole:
 *       type: string
 *       enum: [Admin, Staff, Tenant]
 *       example: Tenant
 */
