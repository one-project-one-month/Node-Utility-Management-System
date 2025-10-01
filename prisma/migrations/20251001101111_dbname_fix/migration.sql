/*
  Warnings:

  - You are about to drop the column `user_id` on the `tenants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenant_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."tenants" DROP CONSTRAINT "tenants_user_id_fkey";

-- DropIndex
DROP INDEX "public"."tenants_user_id_key";

-- AlterTable
ALTER TABLE "public"."tenants" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "tenant_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_tenant_id_key" ON "public"."users"("tenant_id");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
