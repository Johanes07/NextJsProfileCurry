-- CreateTable
CREATE TABLE "appcompany"."CareerHeroContent" (
    "id" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT 'JOIN THE TEAM',
    "headingLine1" TEXT NOT NULL DEFAULT 'WORK WITH',
    "headingLine2" TEXT NOT NULL DEFAULT 'US',
    "subtitle" TEXT NOT NULL DEFAULT 'Be part of something obsessive. We are always looking for passionate people who love food as much as we do.',
    "imageUrl" TEXT DEFAULT '/images/chef.jpg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerHeroContent_pkey" PRIMARY KEY ("id")
);
