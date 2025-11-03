/**
 * @swagger
 * components:
 *   parameters:
 *     # Pagination Parameters
 *     PageQuery:
 *       name: page
 *       in: query
 *       description: Page number for pagination
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         example: 1
 *
 *     LimitQuery:
 *       name: limit
 *       in: query
 *       description: Number of items per page
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         example: 10
 *
 *     # ID Parameters
 *     UserIdParam:
 *       name: userId
 *       in: path
 *       description: User ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: 974cbaf3-78b9-41f0-b6e9-8a9ddf9682d3
 *
 *     TenantIdParam:
 *       name: tenantId
 *       in: path
 *       description: Tenant ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *
 *     OccupantIdParam:
 *       name: occupantId
 *       in: path
 *       description: Occupant ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *
 *     GetOccupantByTenantParam:
 *       name: tenantId
 *       in: path
 *       description: Tenant ID (UUID) to get occupants for
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *
 *     CustomerServiceIdParam:
 *       name: id
 *       in: path
 *       description: Customer Service ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: c54e9b25-d17f-4c8f-9c73-15fd95a62f1f
 *
 *     ReceiptIdParam:
 *       name: id
 *       in: path
 *       description: Receipt ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: 7fc98505-605f-49d2-a3b8-3c6f6eac0ad2
 *
 *     TotalUnitsIdParam:
 *       name: id
 *       in: path
 *       description: Total Units ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *
 *     InvoiceIdParam:
 *       name: invoiceId
 *       in: path
 *       description: Invoice ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: d1ea2e8f-c047-48e0-bd90-d26356674d47
 *
 *     BillIdParam:
 *       name: billId
 *       in: path
 *       description: Bill ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *
 *     BillTenantIdParam:
 *       name: tenantId
 *       in: path
 *       description: Tenant ID (UUID) for bill operations
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: 2ca12c44-dfc8-4c24-a5d3-5ef650b02758
 *
 *     ContractIdParam:
 *       name: contractId
 *       in: path
 *       description: Contract ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *
 *     ContractTypeIdParam:
 *       name: contractTypeId
 *       in: path
 *       description: Contract Type ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: b2c3d4e5-f6g7-8901-bcde-f23456789012
 *
 *     RoomIdParam:
 *       name: roomId
 *       in: path
 *       description: Room ID (UUID)
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: d44605d3-4f8e-4057-b778-201111db860d
 *
 *     # Filter Parameters
 *     RoleFilterParam:
 *       name: role
 *       in: query
 *       description: Filter by user role
 *       required: false
 *       schema:
 *         $ref: '#/components/schemas/UserRole'
 *
 *     ActiveFilterParam:
 *       name: isActive
 *       in: query
 *       description: Filter by active status
 *       required: false
 *       schema:
 *         type: boolean
 *         example: true
 *
 *     PaymentMethodFilterParam:
 *       name: paymentMethod
 *       in: query
 *       description: Filter by payment method
 *       required: false
 *       schema:
 *         type: string
 *         enum: [Cash, Mobile Banking]
 *         example: Cash
 *
 *     StatusParam:
 *       name: status
 *       in: path
 *       description: Service status filter
 *       required: true
 *       schema:
 *         type: string
 *         enum: [Pending, Ongoing, Resolved]
 *         example: Pending
 *
 *     RoomStatusFilterParam:
 *       name: status
 *       in: query
 *       description: Filter by room status
 *       required: false
 *       schema:
 *         type: string
 *         enum: [Available, Rented, Maintenance]
 *         example: Available
 *
 *     CategoryParam:
 *        name: category
 *        in: query
 *        description: Filter by category
 *        required: false
 *        schema:
 *          type: string
 *          enum: [Complain, Maintenance, Other]
 *          example: Complain
 *
 *     PriorityLevelParam:
 *        name: priorityLevel
 *        in: query
 *        description: Filter by priority
 *        required: false
 *        schema:
 *          type: string
 *          enum: [Low, Medium, High]
 *          example: Low
 *
 *     StatusQuery:
 *        name: status
 *        in: query
 *        description: Filter by status
 *        required: false
 *        schema:
 *          type: string
 *          enum: [Pending, Ongoing, Resolved]
 *          example: Pending
 *
 *     SearchParam:
 *       name: search
 *       in: query
 *       description: Filter by search term (desc or roomNo)
 *       required: false
 *       schema:
 *         type: string
 *         example: "search term"
 *
 *     TenantNameQuery:
 *       name: tenantName
 *       in: query
 *       description: Filter by tenant name
 *       required: false
 *       schema:
 *         type: string
 *         example: 'John Doe'
 *
 *     RoomNoQuery:
 *       name: roomNo
 *       in: query
 *       description: Filter by room number
 *       required: false
 *       schema:
 *         type: string
 *         example: '101'
 *
 *     # Invoice Filter Parameters
 *     InvoiceStatusParam:
 *       name: status
 *       in: query
 *       description: Filter by invoice status
 *       required: false
 *       schema:
 *         type: string
 *         enum: [Pending, Paid, Overdue]
 *         example: Overdue
 *
 *     MonthParam:
 *       name: month
 *       in: query
 *       description: |-
 *         Filter by month. Accepts:
 *         - Full names (January, February, etc.)
 *         - Partial names (Janu, Febr, Octo, etc.)
 *         - 3-letter abbreviations (Jan, Feb, Oct, etc.)
 *         - Case insensitive
 *       required: false
 *       schema:
 *         type: string
 *         example: October
 *
 *     YearParam:
 *       name: year
 *       in: query
 *       description: Filter by year (4 digits)
 *       required: false
 *       schema:
 *         type: string
 *         pattern: '^\d{4}$'
 *         example: '2024'
 */
