-- AlterTable
ALTER TABLE "public"."bills" ALTER COLUMN "service_fee" DROP NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
