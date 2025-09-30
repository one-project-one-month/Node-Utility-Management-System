-- CreateEnum
CREATE TYPE "public"."RoomStatus" AS ENUM ('Available', 'Rented', 'Purchased', 'InMaintenance');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('Tenant', 'Admin', 'Staff');

-- CreateTable
CREATE TABLE "public"."rooms" (
    "id" TEXT NOT NULL,
    "roomNo" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "dimension" TEXT NOT NULL,
    "noOfBedRoom" INTEGER NOT NULL,
    "status" "public"."RoomStatus" NOT NULL DEFAULT 'Available',
    "sellingPrice" DECIMAL(65,30),
    "maxNoPeople" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "facilities" TEXT[],

    CONSTRAINT "contract_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contracts" (
    "id" TEXT NOT NULL,
    "roomNo" INTEGER NOT NULL,
    "contractId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenants" (
    "id" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nrc" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phNumber" TEXT NOT NULL,
    "emergencyNo" TEXT NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'Staff',
    "tenantId" TEXT,
    "refreshToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_RoomToTenant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoomToTenant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomNo_key" ON "public"."rooms"("roomNo");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "public"."tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "public"."users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_key" ON "public"."users"("tenantId");

-- CreateIndex
CREATE INDEX "_RoomToTenant_B_index" ON "public"."_RoomToTenant"("B");

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_roomNo_fkey" FOREIGN KEY ("roomNo") REFERENCES "public"."rooms"("roomNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contracts" ADD CONSTRAINT "contracts_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."contract_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoomToTenant" ADD CONSTRAINT "_RoomToTenant_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoomToTenant" ADD CONSTRAINT "_RoomToTenant_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
