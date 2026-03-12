-- AlterTable
ALTER TABLE "appcompany"."AdminNavChild" ADD COLUMN     "allowedRoles" TEXT[] DEFAULT ARRAY['superadmin', 'admin', 'user']::TEXT[];

-- AlterTable
ALTER TABLE "appcompany"."AdminNavItem" ADD COLUMN     "allowedRoles" TEXT[] DEFAULT ARRAY['superadmin', 'admin', 'user']::TEXT[];
