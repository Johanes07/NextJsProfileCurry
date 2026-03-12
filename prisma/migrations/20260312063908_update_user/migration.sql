/*
  Warnings:

  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appcompany"."UserPermission" DROP CONSTRAINT "UserPermission_userId_fkey";

-- AlterTable
ALTER TABLE "appcompany"."User" DROP COLUMN "isActive",
ALTER COLUMN "role" SET DEFAULT 'admin';

-- DropTable
DROP TABLE "appcompany"."UserPermission";
