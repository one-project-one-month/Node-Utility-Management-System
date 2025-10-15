/*
  Warnings:

  - You are about to drop the column `emails` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_nos` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `names` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `nrcs` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `phone_nos` on the `tenants` table. All the data in the column will be lost.
  - Added the required column `email` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergency_no` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nrc` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_no` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelationshipToTenant" AS ENUM ('SPOUSE', 'PARENT', 'CHILD', 'SIBLING', 'RELATIVE', 'FRIEND', 'OTHER');

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "emails",
DROP COLUMN "emergency_nos",
DROP COLUMN "names",
DROP COLUMN "nrcs",
DROP COLUMN "phone_nos",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emergency_no" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nrc" TEXT NOT NULL,
ADD COLUMN     "phone_no" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "occupants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nrc" TEXT,
    "relationship_to_tenant" "RelationshipToTenant" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "occupants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "occupants" ADD CONSTRAINT "occupants_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
