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
 *                             - $ref: '#/components/schemas/UserWithTenant'
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
 *                           allOf:
 *                             - $ref: '#/components/schemas/Receipt'
 *                             - type: object
 *                               properties:
 *                                 invoiceId:
 *                                   type: string
 *                                   format: uuid
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
 *                           allOf:
 *                             - $ref: '#/components/schemas/TotalUnits'
 *                             - type: object
 *                               properties:
 *                                 roomId:
 *                                   type: string
 *                                   format: uuid
 *                                   example: 2083c553-c2a6-4e44-9583-f5b2693e9360
 *                                 roomNo:
 *                                   type: integer
 *                                   example: 416
 *                                 floor:
 *                                   type: integer
 *                                   example: 4
 *                                 roomStatus:
 *                                   type: string
 *                                   enum: [Available, Rented, Purchased, InMaintenance]
 *                                   example: Rented
 *                                 tenantName:
 *                                   type: string
 *                                   example: Roosevelt Gislason
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
 *                           $ref: '#/components/schemas/BillWithTenantId'
 *                       meta:
 *                         $ref: '#/components/schemas/PaginationMeta'
 *                       links:
 *                         $ref: '#/components/schemas/PaginationLinks'
 *
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
 *                     example: Invoices fetched successfully
 *                   content:
 *                     type: object
 *                     properties:
 *                       data:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/InvoiceWithDetails'
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
