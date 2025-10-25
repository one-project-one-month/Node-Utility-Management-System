/**
 * @swagger
 * components:
 *   schemas:
 *     ApiSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operation successful
 *         content:
 *           nullable: true
 *         status:
 *           type: number
 *           example: 200
 *
 *     ApiErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Invalid email or password
 *         status:
 *           type: number
 *           example: 401
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 80
 *         currentPage:
 *           type: integer
 *           example: 1
 *         lastPage:
 *           type: integer
 *           example: 80
 *         perPage:
 *           type: integer
 *           example: 10
 *
 *     PaginationLinks:
 *       type: object
 *       properties:
 *         next:
 *           type: string
 *           nullable: true
 *           example: 'http://localhost:3000/api/v1/users/?page=2&limit=10'
 *         prev:
 *           type: string
 *           nullable: true
 *           example: null
 *
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 *         links:
 *           $ref: '#/components/schemas/PaginationLinks'
 */
