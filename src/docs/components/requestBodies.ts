/**
 * @swagger
 * components:
 *   requestBodies:
 *     # Authentication
 *     LoginRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *
 *     # User Management
 *     CreateUserRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: tenant1
 *               email:
 *                 type: string
 *                 example: tenant1@gmail.com
 *               password:
 *                 type: string
 *                 example: tenant123
 *               role:
 *                 type: string
 *                 enum: [Tenant, Admin, Staff]
 *                 example: Tenant
 *               tenantId:
 *                 type: string
 *                 nullable: true
 *                 example:
 *
 *     UpdateUserRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: tenant1
 *               email:
 *                 type: string
 *                 example: tenant1@gmail.com
 *               role:
 *                 type: string
 *                 example: Tenant
 *               tenantId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *
 *     # Customer Service
 *     CreateCustomerServiceRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description, category, status, priorityLevel, roomId]
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 example: 'Air conditioning not working properly'
 *               category:
 *                 type: string
 *                 enum: [Complain, Maintenance, Other]
 *                 example: 'Maintenance'
 *               status:
 *                 type: string
 *                 enum: [Pending, Ongoing, Resolved]
 *                 example: 'Pending'
 *               priorityLevel:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: 'High'
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: 'b7a2cc9b-9f7b-46cf-b3f9-19cb94d68c73'
 *
 *     UpdateCustomerServiceRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: At least `status` and `priorityLevel` must both be provided.
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 example: 'Rechecked the air conditioning issue.'
 *               category:
 *                 type: string
 *                 enum: [Complain, Maintenance, Other]
 *                 example: 'Maintenance'
 *               status:
 *                 type: string
 *                 enum: [Pending, Ongoing, Resolved]
 *                 example: 'Resolved'
 *               priorityLevel:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: 'High'
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: 'b7a2cc9b-9f7b-46cf-b3f9-19cb94d68c73'
 *
 *     # Tenant Management
 *     CreateTenantRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nrc, email, phoneNo, emergencyNo, roomId]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: John Doe
 *               nrc:
 *                 type: string
 *                 minLength: 5
 *                 example: '12/ABCD(N)854324'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@gmail.com
 *               phoneNo:
 *                 type: string
 *                 pattern: '^[0-9]{6,15}$'
 *                 example: '959452897714'
 *               emergencyNo:
 *                 type: string
 *                 pattern: '^[0-9]{6,15}$'
 *                 example: '959202435118'
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: d44605d3-4f8e-4057-b778-201111db860d
 *               occupants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       minLength: 1
 *                       example: Jane Doe
 *                     nrc:
 *                       type: string
 *                       minLength: 5
 *                       nullable: true
 *                       example: '12/EFGH(N)123456'
 *                     relationshipToTenant:
 *                       type: string
 *                       enum: [SPOUSE, PARENT, CHILD, SIBLING, RELATIVE, FRIEND, OTHER]
 *                       example: SPOUSE
 *
 *     UpdateTenantRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: John Doe Updated
 *               nrc:
 *                 type: string
 *                 minLength: 5
 *                 example: '12/ABCD(N)854325'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@gmail.com
 *               phoneNo:
 *                 type: string
 *                 pattern: '^[0-9]{6,15}$'
 *                 example: '959452897715'
 *               emergencyNo:
 *                 type: string
 *                 pattern: '^[0-9]{6,15}$'
 *                 example: '959202435119'
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 example: d44605d3-4f8e-4057-b778-201111db860d
 *               occupantId:
 *                 type: string
 *                 format: uuid
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *
 *     # Occupant Management
 *     CreateOccupantRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             minItems: 1
 *             items:
 *               type: object
 *               required: [name, relationshipToTenant, tenantId]
 *               properties:
 *                 name:
 *                   type: string
 *                   minLength: 1
 *                   example: Jane Doe
 *                 nrc:
 *                   type: string
 *                   minLength: 5
 *                   nullable: true
 *                   example: '12/EFGH(N)123456'
 *                 relationshipToTenant:
 *                   type: string
 *                   enum: [SPOUSE, PARENT, CHILD, SIBLING, RELATIVE, FRIEND, OTHER]
 *                   example: SPOUSE
 *                 tenantId:
 *                   type: string
 *                   format: uuid
 *                   example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *
 *     UpdateOccupantRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: Jane Doe Updated
 *               nrc:
 *                 type: string
 *                 minLength: 5
 *                 nullable: true
 *                 example: '12/EFGH(N)123457'
 *               relationshipToTenant:
 *                 type: string
 *                 enum: [SPOUSE, PARENT, CHILD, SIBLING, RELATIVE, FRIEND, OTHER]
 *                 example: SPOUSE
 *               tenantId:
 *                 type: string
 *                 format: uuid
 *                 example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *
 *     DeleteOccupantRequest:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenantId]
 *             properties:
 *               tenantId:
 *                 type: string
 *                 format: uuid
 *                 example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 */
