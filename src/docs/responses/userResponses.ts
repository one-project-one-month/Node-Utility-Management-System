/**
 * @swagger
 * components:
 *   responses:
 *     GetUserSuccess:
 *       description: User fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/UserWithTenant'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     CreateUserSuccess:
 *       description: User created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/TenantUser'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateUserSuccess:
 *       description: User updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       user:
 *                         oneOf:
 *                           - $ref: '#/components/schemas/AdminUser'
 *                           - $ref: '#/components/schemas/TenantUser'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     DeleteUserSuccess:
 *       description: User deleted successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   content:
 *                     type: object
 *                     $ref: '#/components/schemas/TenantUser'
 *                   message:
 *                     type: string
 *                     example: User deleted successfully
 */
