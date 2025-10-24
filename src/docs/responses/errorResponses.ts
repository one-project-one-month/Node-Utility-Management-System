/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiErrorResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Access token is required
 *                   status:
 *                     type: integer
 *                     example: 401
 *
 *     ForbiddenError:
 *       description: Forbidden - Admin or Staff role required
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiErrorResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 'Required roles: Admin, Staff'
 *                   status:
 *                     type: integer
 *                     example: 403
 *
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiErrorResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Resource not found
 *                   status:
 *                     type: integer
 *                     example: 404
 *
 *     BadRequestError:
 *       description: Bad Request
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiErrorResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Validation failed
 *                   status:
 *                     type: integer
 *                     example: 400
 *
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiErrorResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Validation failed
 *                   details:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         path:
 *                           type: string
 *                           example: name
 *                         message:
 *                           type: string
 *                           example: Name is required
 *                   status:
 *                     type: integer
 *                     example: 400
 */
