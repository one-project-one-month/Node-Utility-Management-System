-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('Cash', 'Mobile_Banking');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('Overdue', 'Paid', 'Pending');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('Complain', 'Maintenance', 'Other');

-- CreateEnum
CREATE TYPE "public"."ServiceStatus" AS ENUM ('Pending', 'Ongoing', 'Resolved');

-- CreateEnum
CREATE TYPE "public"."PriorityLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "public"."RoomStatus" AS ENUM ('Available', 'Rented', 'Purchased', 'InMaintenance');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('Tenant', 'Admin', 'Staff');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "refresh_token" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenants" (
    "id" TEXT NOT NULL,
    "names" TEXT[],
    "emails" TEXT[],
    "nrcs" TEXT[],
    "phone_nos" TEXT[],
    "emergency_nos" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rooms" (
    "id" TEXT NOT NULL,
    "room_no" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "dimension" TEXT NOT NULL,
    "no_of_bed_room" INTEGER NOT NULL,
    "status" "public"."RoomStatus" NOT NULL DEFAULT 'Available',
    "selling_price" DECIMAL(65,30),
    "max_no_of_people" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contracts" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "facilities" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer_services" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "status" "public"."ServiceStatus" NOT NULL,
    "priority_level" "public"."PriorityLevel" NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "customer_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bills" (
    "id" TEXT NOT NULL,
    "rental_fee" DECIMAL(65,30) NOT NULL,
    "electricity_fee" DECIMAL(65,30) NOT NULL,
    "water_fee" DECIMAL(65,30) NOT NULL,
    "fine_fee" DECIMAL(65,30),
    "service_fee" DECIMAL(65,30) NOT NULL,
    "ground_fee" DECIMAL(65,30) NOT NULL,
    "car_parking_fee" DECIMAL(65,30),
    "wifi_fee" DECIMAL(65,30),
    "total_amount" DECIMAL(65,30) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."total_units" (
    "id" TEXT NOT NULL,
    "electricity_units" DECIMAL(65,30) NOT NULL,
    "water_units" DECIMAL(65,30) NOT NULL,
    "created_at" DECIMAL(65,30) NOT NULL,
    "bill_id" TEXT NOT NULL,

    CONSTRAINT "total_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL,
    "bill_id" TEXT NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."receipts" (
    "id" TEXT NOT NULL,
    "payment_method" "public"."PaymentMethod" NOT NULL,
    "invoice_id" TEXT NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenant_id_key" ON "public"."users"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_room_id_key" ON "public"."tenants"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_room_no_key" ON "public"."rooms"("room_no");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_room_id_key" ON "public"."contracts"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "bills_room_id_key" ON "public"."bills"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "total_units_bill_id_key" ON "public"."total_units"("bill_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_bill_id_key" ON "public"."invoices"("bill_id");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_invoice_id_key" ON "public"."receipts"("invoice_id");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tenants" ADD CONSTRAINT "tenants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_services" ADD CONSTRAINT "customer_services_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bills" ADD CONSTRAINT "bills_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."total_units" ADD CONSTRAINT "total_units_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."receipts" ADD CONSTRAINT "receipts_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
