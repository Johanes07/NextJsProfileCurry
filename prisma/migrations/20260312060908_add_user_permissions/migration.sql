-- AlterTable
ALTER TABLE "appcompany"."User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "appcompany"."UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_href_key" ON "appcompany"."UserPermission"("userId", "href");

-- AddForeignKey
ALTER TABLE "appcompany"."UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "appcompany"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
