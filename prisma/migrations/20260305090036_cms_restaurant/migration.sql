/*
  Warnings:

  - You are about to drop the column `phone` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `faviconUrl` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `twitterUrl` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the `AboutSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HeroSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ContactMessage" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "faviconUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "twitterUrl",
ADD COLUMN     "mapLat" DOUBLE PRECISION,
ADD COLUMN     "mapLng" DOUBLE PRECISION,
ADD COLUMN     "openHours" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT,
ALTER COLUMN "siteName" SET DEFAULT '100Hours Curry';

-- DropTable
DROP TABLE "AboutSection";

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "HeroSection";

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "spice" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promo" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "ctaLink" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SosmedPost" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SosmedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "requirements" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutContent" (
    "id" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "founded" TEXT NOT NULL,
    "locations" TEXT NOT NULL,
    "bowlsServed" TEXT NOT NULL,
    "imageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);
