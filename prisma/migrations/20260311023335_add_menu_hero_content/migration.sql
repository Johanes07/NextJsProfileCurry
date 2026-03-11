-- CreateTable
CREATE TABLE "appcompany"."MenuHeroContent" (
    "id" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT 'CRAFTED WITH OBSESSION',
    "headingLine1" TEXT NOT NULL DEFAULT 'OUR',
    "headingLine2" TEXT NOT NULL DEFAULT 'MENU',
    "subtitle" TEXT NOT NULL DEFAULT 'Every dish slow-cooked to perfection. Choose your curry, choose your adventure.',
    "imageUrl" TEXT DEFAULT '/images/MAINDISH/AI1.png',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuHeroContent_pkey" PRIMARY KEY ("id")
);
