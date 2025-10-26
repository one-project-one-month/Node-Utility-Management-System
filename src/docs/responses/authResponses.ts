/**
 * @swagger
 * components:
 *   responses:
 *     LoginSuccess:
 *       description: User signed in successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Sign in successful
 *                   content:
 *                     type: object
 *                     properties:
 *                       user:
 *                         $ref: '#/components/schemas/AdminUser'
 *                       accessToken:
 *                         type: string
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

/**
 * @swagger
 * components:
 *   responses:
 *     LogoutSuccess:
 *       description: User signed out successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Sign out successful
 */

/**
 * @swagger
 * components:
 *   responses:
 *     RefreshTokenSuccess:
 *       description: Access token refreshed successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Token refreshed successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       accessToken:
 *                         type: string
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
