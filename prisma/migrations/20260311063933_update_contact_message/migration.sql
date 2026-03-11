-- AlterTable
ALTER TABLE "appcompany"."ContactMessage" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';
