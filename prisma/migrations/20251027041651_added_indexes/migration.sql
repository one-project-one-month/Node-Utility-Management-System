-- CreateIndex
CREATE INDEX "bills_roomId_idx" ON "bills"("roomId");

-- CreateIndex
CREATE INDEX "bills_dueDate_idx" ON "bills"("dueDate");

-- CreateIndex
CREATE INDEX "bills_roomId_dueDate_idx" ON "bills"("roomId", "dueDate");

-- CreateIndex
CREATE INDEX "contract_types_name_idx" ON "contract_types"("name");

-- CreateIndex
CREATE INDEX "contracts_tenantId_idx" ON "contracts"("tenantId");

-- CreateIndex
CREATE INDEX "contracts_roomId_idx" ON "contracts"("roomId");

-- CreateIndex
CREATE INDEX "contracts_expiryDate_idx" ON "contracts"("expiryDate");

-- CreateIndex
CREATE INDEX "contracts_tenantId_expiryDate_idx" ON "contracts"("tenantId", "expiryDate");

-- CreateIndex
CREATE INDEX "customer_services_roomId_idx" ON "customer_services"("roomId");

-- CreateIndex
CREATE INDEX "customer_services_status_priorityLevel_idx" ON "customer_services"("status", "priorityLevel");

-- CreateIndex
CREATE INDEX "customer_services_category_status_idx" ON "customer_services"("category", "status");

-- CreateIndex
CREATE INDEX "customer_services_createdAt_idx" ON "customer_services"("createdAt");

-- CreateIndex
CREATE INDEX "invoices_billId_idx" ON "invoices"("billId");

-- CreateIndex
CREATE INDEX "invoices_status_createdAt_idx" ON "invoices"("status", "createdAt");

-- CreateIndex
CREATE INDEX "invoices_status_receiptSent_idx" ON "invoices"("status", "receiptSent");

-- CreateIndex
CREATE INDEX "occupants_tenantId_idx" ON "occupants"("tenantId");

-- CreateIndex
CREATE INDEX "occupants_tenantId_relationshipToTenant_idx" ON "occupants"("tenantId", "relationshipToTenant");

-- CreateIndex
CREATE INDEX "receipts_invoiceId_idx" ON "receipts"("invoiceId");

-- CreateIndex
CREATE INDEX "receipts_paidDate_idx" ON "receipts"("paidDate");

-- CreateIndex
CREATE INDEX "rooms_roomNo_idx" ON "rooms"("roomNo");

-- CreateIndex
CREATE INDEX "rooms_status_floor_idx" ON "rooms"("status", "floor");

-- CreateIndex
CREATE INDEX "rooms_status_createdAt_idx" ON "rooms"("status", "createdAt");

-- CreateIndex
CREATE INDEX "tenants_email_idx" ON "tenants"("email");

-- CreateIndex
CREATE INDEX "tenants_nrc_idx" ON "tenants"("nrc");

-- CreateIndex
CREATE INDEX "tenants_phoneNo_idx" ON "tenants"("phoneNo");

-- CreateIndex
CREATE INDEX "tenants_roomId_idx" ON "tenants"("roomId");

-- CreateIndex
CREATE INDEX "tenants_name_email_idx" ON "tenants"("name", "email");

-- CreateIndex
CREATE INDEX "total_units_billId_idx" ON "total_units"("billId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_isActive_idx" ON "users"("role", "isActive");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");
