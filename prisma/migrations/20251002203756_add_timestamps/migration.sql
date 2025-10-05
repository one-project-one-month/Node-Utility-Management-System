/*
  Warnings:

  - You are about to drop the column `contract_id` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `issue_date` on the `customer_services` table. All the data in the column will be lost.
  - The `created_at` column on the `total_units` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tenant_id]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contract_type_id` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `customer_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `total_units` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_contract_id_fkey";

-- AlterTable
ALTER TABLE "public"."contracts" DROP COLUMN "contract_id",
ADD COLUMN     "contract_type_id" TEXT NOT NULL,
ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."customer_services" DROP COLUMN "issue_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."invoices" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."total_units" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "contracts_tenant_id_key" ON "public"."contracts"("tenant_id");

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_contract_type_id_fkey" FOREIGN KEY ("contract_type_id") REFERENCES "public"."contract_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
