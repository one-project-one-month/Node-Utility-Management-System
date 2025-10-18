/*
  Warnings:

  - You are about to drop the column `car_parking_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `electricity_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `fine_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `ground_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `rental_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `service_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `water_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `wifi_fee` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `contract_types` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `contract_types` table. All the data in the column will be lost.
  - You are about to drop the column `contract_type_id` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `created_date` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `expiry_date` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_date` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `customer_services` table. All the data in the column will be lost.
  - You are about to drop the column `issued_date` on the `customer_services` table. All the data in the column will be lost.
  - You are about to drop the column `priority_level` on the `customer_services` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `customer_services` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `customer_services` table. All the data in the column will be lost.
  - You are about to drop the column `bill_id` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_no` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `occupants` table. All the data in the column will be lost.
  - You are about to drop the column `relationship_to_tenant` on the `occupants` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `occupants` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `occupants` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_id` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `paid_date` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `receipts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `max_no_of_people` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `no_of_bed_room` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `room_no` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `selling_price` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_no` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `phone_no` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `bill_id` on the `total_units` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `total_units` table. All the data in the column will be lost.
  - You are about to drop the column `electricity_units` on the `total_units` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `total_units` table. All the data in the column will be lost.
  - You are about to drop the column `water_units` on the `total_units` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceNo]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[billId]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceId]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomNo]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[billId]` on the table `total_units` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dueDate` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electricityFee` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groundFee` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalFee` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterFee` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contract_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractTypeId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdDate` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedDate` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priorityLevel` to the `customer_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `customer_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `customer_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billId` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNo` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationshipToTenant` to the `occupants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `occupants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `occupants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `receipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `receipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxNoOfPeople` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfBedRoom` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomNo` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyNo` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billId` to the `total_units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electricityUnits` to the `total_units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `total_units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterUnits` to the `total_units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."bills" DROP CONSTRAINT "bills_room_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_contract_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_room_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."customer_services" DROP CONSTRAINT "customer_services_room_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "invoices_bill_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."occupants" DROP CONSTRAINT "occupants_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."receipts" DROP CONSTRAINT "receipts_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tenants" DROP CONSTRAINT "tenants_room_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."total_units" DROP CONSTRAINT "total_units_bill_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_tenant_id_fkey";

-- DropIndex
DROP INDEX "public"."contracts_room_id_key";

-- DropIndex
DROP INDEX "public"."contracts_tenant_id_key";

-- DropIndex
DROP INDEX "public"."invoices_bill_id_key";

-- DropIndex
DROP INDEX "public"."invoices_invoice_no_key";

-- DropIndex
DROP INDEX "public"."receipts_invoice_id_key";

-- DropIndex
DROP INDEX "public"."rooms_room_no_key";

-- DropIndex
DROP INDEX "public"."tenants_room_id_key";

-- DropIndex
DROP INDEX "public"."total_units_bill_id_key";

-- DropIndex
DROP INDEX "public"."users_tenant_id_key";

-- AlterTable
ALTER TABLE "public"."bills" DROP COLUMN "car_parking_fee",
DROP COLUMN "created_at",
DROP COLUMN "due_date",
DROP COLUMN "electricity_fee",
DROP COLUMN "fine_fee",
DROP COLUMN "ground_fee",
DROP COLUMN "rental_fee",
DROP COLUMN "room_id",
DROP COLUMN "service_fee",
DROP COLUMN "total_amount",
DROP COLUMN "updated_at",
DROP COLUMN "water_fee",
DROP COLUMN "wifi_fee",
ADD COLUMN     "carParkingFee" DECIMAL(65,30),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "electricityFee" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "fineFee" DECIMAL(65,30),
ADD COLUMN     "groundFee" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "rentalFee" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "serviceFee" DECIMAL(65,30),
ADD COLUMN     "totalAmount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "waterFee" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "wifiFee" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."contract_types" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."contracts" DROP COLUMN "contract_type_id",
DROP COLUMN "created_date",
DROP COLUMN "expiry_date",
DROP COLUMN "room_id",
DROP COLUMN "tenant_id",
DROP COLUMN "updated_date",
ADD COLUMN     "contractTypeId" TEXT NOT NULL,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "updatedDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."customer_services" DROP COLUMN "created_at",
DROP COLUMN "issued_date",
DROP COLUMN "priority_level",
DROP COLUMN "room_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priorityLevel" "public"."PriorityLevel" NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."invoices" DROP COLUMN "bill_id",
DROP COLUMN "created_at",
DROP COLUMN "invoice_no",
DROP COLUMN "updated_at",
ADD COLUMN     "billId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "invoiceNo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."occupants" DROP COLUMN "created_at",
DROP COLUMN "relationship_to_tenant",
DROP COLUMN "tenant_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "relationshipToTenant" "public"."RelationshipToTenant" NOT NULL,
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."receipts" DROP COLUMN "created_at",
DROP COLUMN "invoice_id",
DROP COLUMN "paid_date",
DROP COLUMN "payment_method",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "invoiceId" TEXT NOT NULL,
ADD COLUMN     "paidDate" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'Cash',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."rooms" DROP COLUMN "created_at",
DROP COLUMN "max_no_of_people",
DROP COLUMN "no_of_bed_room",
DROP COLUMN "room_no",
DROP COLUMN "selling_price",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maxNoOfPeople" INTEGER NOT NULL,
ADD COLUMN     "noOfBedRoom" INTEGER NOT NULL,
ADD COLUMN     "roomNo" INTEGER NOT NULL,
ADD COLUMN     "sellingPrice" DECIMAL(65,30),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."tenants" DROP COLUMN "created_at",
DROP COLUMN "emergency_no",
DROP COLUMN "phone_no",
DROP COLUMN "room_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emergencyNo" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."total_units" DROP COLUMN "bill_id",
DROP COLUMN "created_at",
DROP COLUMN "electricity_units",
DROP COLUMN "updated_at",
DROP COLUMN "water_units",
ADD COLUMN     "billId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "electricityUnits" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "waterUnits" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "refresh_token",
DROP COLUMN "tenant_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tenantId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contracts_roomId_key" ON "public"."contracts"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_tenantId_key" ON "public"."contracts"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNo_key" ON "public"."invoices"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_billId_key" ON "public"."invoices"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_invoiceId_key" ON "public"."receipts"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomNo_key" ON "public"."rooms"("roomNo");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_roomId_key" ON "public"."tenants"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "total_units_billId_key" ON "public"."total_units"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_key" ON "public"."users"("tenantId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tenants" ADD CONSTRAINT "tenants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."occupants" ADD CONSTRAINT "occupants_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_contractTypeId_fkey" FOREIGN KEY ("contractTypeId") REFERENCES "public"."contract_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_services" ADD CONSTRAINT "customer_services_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bills" ADD CONSTRAINT "bills_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."total_units" ADD CONSTRAINT "total_units_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."receipts" ADD CONSTRAINT "receipts_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
