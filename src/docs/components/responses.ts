/**
 * @swagger
 * components:
 *   responses:
 *     # Success Responses
 *     SuccessResponse:
 *       description: Operation successful
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiSuccessResponse'
 *
 *     # Specific Resource Responses
 *     OccupantsByTenantResponse:
 *       description: Occupants fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Occupants fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           allOf:
 *                             - $ref: '#/components/schemas/Occupant'
 *                             - type: object
 *                               properties:
 *                                 tenant:
 *                                   type: object
 *                                   $ref: '#/components/schemas/Tenant'
 *
 *     # Paginated Responses
 *     PaginatedUsersResponse:
 *       description: Users fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Users fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           oneOf:
 *                             - allOf:
 *                                 - $ref: '#/components/schemas/TenantUser'
 *                                 - type: object
 *                                   properties:
 *                                     tenant:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: string
 *                                           format: uuid
 *                                           example: 456e7890-f12a-34b5-c678-426614174000
 *                                         name:
 *                                           type: string
 *                                           example: Test Tenant
 *                                         roomId:
 *                                           type: string
 *                                           format: uuid
 *                                           example: d44605d3-4f8e-4057-b778-201111db860d
 *                             - allOf:
 *                                 - $ref: '#/components/schemas/AdminUser'
 *                                 - type: object
 *                                   properties:
 *                                     tenant:
 *                                       type: object
 *                                       example: null
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedCustomerServicesResponse:
 *       description: Customer services retrieved successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Fetch customer services successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/CustomerService'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedTenantsResponse:
 *       description: Tenants retrieved successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: All tenants get successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           allOf:
 *                             - $ref: '#/components/schemas/Tenant'
 *                             - type: object
 *                               properties:
 *                                 room:
 *                                   type: object
 *                                   $ref: '#/components/schemas/Room'
 *                                 occupants:
 *                                   type: array
 *                                   items:
 *                                     $ref: '#/components/schemas/Occupant'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedOccupantsResponse:
 *       description: Occupants retrieved successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: All occupants get successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           allOf:
 *                             - $ref: '#/components/schemas/Occupant'
 *                             - type: object
 *                               properties:
 *                                 tenants:
 *                                   type: object
 *                                   $ref: '#/components/schemas/Tenant'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedReceiptsResponse:
 *       description: Receipts fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Receipts fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Receipt'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedTotalUnitsResponse:
 *       description: Total units fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Total-units fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/TotalUnits'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedContractsResponse:
 *       description: Contracts fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: All Contracts fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Contract'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedRoomsResponse:
 *       description: Rooms fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Rooms fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Room'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedBillsResponse:
 *       description: Bills fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: All Bills fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/BillWithTenant'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     PaginatedBillHistoryResponse:
 *       description: Bill history fetched successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bill History fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/BillWithTenant'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *     PaginatedInvoicesResponse:
 *       description: Invoices retrieved successfully with pagination
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Invoices retrieved successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Invoice'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
 *     # Special Responses
 *     AutoGenerateBillsResponse:
 *       description: Bills auto-generated successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bills auto-generated successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: string
 *                         example: Bill generated for 15 rooms and sent invoices via mail
 *
 *     LatestBillResponse:
 *       description: Latest bill fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/ApiSuccessResponse'
 *               - type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Latest Bill fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         $ref: '#/components/schemas/BillWithTenant'
 */
