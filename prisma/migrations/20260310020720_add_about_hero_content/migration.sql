-- CreateTable
CREATE TABLE "appcompany"."AboutHeroContent" (
    "id" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT 'OUR STORY',
    "headingLine1" TEXT NOT NULL DEFAULT 'ABOUT',
    "headingLine2" TEXT NOT NULL DEFAULT '100HOURS',
    "description" TEXT NOT NULL DEFAULT 'Born from obsession. Driven by flavor. We believe the best things in life — and curry — cannot be rushed.',
    "imageUrl" TEXT DEFAULT '/images/MAINDISH/AI8.png',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutHeroContent_pkey" PRIMARY KEY ("id")
);
