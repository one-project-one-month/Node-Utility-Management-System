/**
 * @swagger
 * components:
 *   responses:
 *     CreateContractTypeSuccess:
 *       description: Contract type created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract type created successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contractType:
 *                         $ref: '#/components/schemas/ContractType'
 *                   status:
 *                     type: number
 *                     example: 201
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetContractTypeSuccess:
 *       description: Contract type retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract type retrieved successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contractType:
 *                         $ref: '#/components/schemas/ContractType'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UpdateContractTypeSuccess:
 *       description: Contract type updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Contract type updated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       contractType:
 *                         $ref: '#/components/schemas/ContractType'
 */

/**
 * @swagger
 * components:
 *   responses:
 *     GetAllContractTypesSuccess:
 *       description: Contract types fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: All Contract types fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/ContractType'
 */
