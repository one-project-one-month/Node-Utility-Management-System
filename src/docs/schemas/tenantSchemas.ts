/**
 * @swagger
 * components:
 *   schemas:
 *     Tenant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *         name:
 *           type: string
 *           example: John Doe
 *         nrc:
 *           type: string
 *           example: '12/ABCD(N)854324'
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@gmail.com
 *         phoneNo:
 *           type: string
 *           example: '+959452897714'
 *         emergencyNo:
 *           type: string
 *           example: '+959202435118'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: d44605d3-4f8e-4057-b778-201111db860d
 *
 *     Occupant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *         name:
 *           type: string
 *           example: Jane Doe
 *         nrc:
 *           type: string
 *           nullable: true
 *           example: '12/EFGH(N)123456'
 *         relationshipToTenant:
 *           type: string
 *           enum: [SPOUSE, PARENT, CHILD, SIBLING, RELATIVE, FRIEND, OTHER]
 *           example: SPOUSE
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-05T19:17:18.241Z
 *
 *     RelationshipToTenant:
 *       type: string
 *       enum: [SPOUSE, PARENT, CHILD, SIBLING, RELATIVE, FRIEND, OTHER]
 *       example: SPOUSE
 */
