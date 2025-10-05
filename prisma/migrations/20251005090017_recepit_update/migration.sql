-- AlterTable
ALTER TABLE "public"."receipts" ALTER COLUMN "payment_method" SET DEFAULT 'Cash',
ALTER COLUMN "paid_date" DROP NOT NULL;
