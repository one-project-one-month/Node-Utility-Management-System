/*
  Warnings:

  - A unique constraint covering the columns `[invoice_no]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoice_no` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "invoice_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_no_key" ON "invoices"("invoice_no");
