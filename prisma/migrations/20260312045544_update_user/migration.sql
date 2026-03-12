/*
  Warnings:

  - You are about to drop the column `allowedRoles` on the `AdminNavChild` table. All the data in the column will be lost.
  - You are about to drop the column `allowedRoles` on the `AdminNavItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appcompany"."AdminNavChild" DROP COLUMN "allowedRoles";

-- AlterTable
ALTER TABLE "appcompany"."AdminNavItem" DROP COLUMN "allowedRoles";
