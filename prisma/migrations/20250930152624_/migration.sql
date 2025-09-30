/*
  Warnings:

  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_RoomToTenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contract_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contracts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('Complain', 'Maintenance', 'Other');

-- CreateEnum
CREATE TYPE "public"."ServiceStatus" AS ENUM ('Pending', 'Ongoing', 'Resolved');

-- CreateEnum
CREATE TYPE "public"."PriorityLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('Overdue', 'Paid', 'Pending');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('Cash', 'Mobile_Banking');

-- DropForeignKey
ALTER TABLE "public"."_RoomToTenant" DROP CONSTRAINT "_RoomToTenant_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RoomToTenant" DROP CONSTRAINT "_RoomToTenant_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_contractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_roomNo_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_tenantId_fkey";

-- DropIndex
DROP INDEX "public"."users_tenantId_key";

-- DropIndex
DROP INDEX "public"."users_userName_key";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "refreshToken",
DROP COLUMN "tenantId",
DROP COLUMN "updatedAt",
DROP COLUMN "userName",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_name" TEXT NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."_RoomToTenant";

-- DropTable
DROP TABLE "public"."contract_types";

-- DropTable
DROP TABLE "public"."contracts";

-- DropTable
DROP TABLE "public"."rooms";

-- DropTable
DROP TABLE "public"."tenants";

-- CreateTable
CREATE TABLE "public"."Room" (
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

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tenant" (
    "id" TEXT NOT NULL,
    "names" TEXT[],
    "emails" TEXT[],
    "nrcs" TEXT[],
    "phone_nos" TEXT[],
    "emergency_nos" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContractType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "facilities" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerService" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "status" "public"."ServiceStatus" NOT NULL,
    "priority_level" "public"."PriorityLevel" NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "CustomerService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Billing" (
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

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TotalUnits" (
    "id" TEXT NOT NULL,
    "electricity_units" DECIMAL(65,30) NOT NULL,
    "water_units" DECIMAL(65,30) NOT NULL,
    "created_at" DECIMAL(65,30) NOT NULL,
    "billing_id" TEXT NOT NULL,

    CONSTRAINT "TotalUnits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL,
    "billing_id" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Receipt" (
    "id" TEXT NOT NULL,
    "payment_method" "public"."PaymentMethod" NOT NULL,
    "invoice_id" TEXT NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_no_key" ON "public"."Room"("room_no");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_room_id_key" ON "public"."Tenant"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_user_id_key" ON "public"."Tenant"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_room_id_key" ON "public"."Contract"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_room_id_key" ON "public"."Billing"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "TotalUnits_billing_id_key" ON "public"."TotalUnits"("billing_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_billing_id_key" ON "public"."Invoice"("billing_id");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_invoice_id_key" ON "public"."Receipt"("invoice_id");

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."ContractType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerService" ADD CONSTRAINT "CustomerService_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Billing" ADD CONSTRAINT "Billing_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TotalUnits" ADD CONSTRAINT "TotalUnits_billing_id_fkey" FOREIGN KEY ("billing_id") REFERENCES "public"."Billing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_billing_id_fkey" FOREIGN KEY ("billing_id") REFERENCES "public"."Billing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Receipt" ADD CONSTRAINT "Receipt_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
