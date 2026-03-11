-- CreateTable
CREATE TABLE "appcompany"."ContactHeroContent" (
    "id" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT 'FIND US',
    "headingLine1" TEXT NOT NULL DEFAULT 'GET IN',
    "headingLine2" TEXT NOT NULL DEFAULT 'TOUCH',
    "subtitle" TEXT NOT NULL DEFAULT 'Have a question? Want to reserve a table? We would love to hear from you.',
    "imageUrl" TEXT DEFAULT '/images/MAINDISH/AI3.png',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactHeroContent_pkey" PRIMARY KEY ("id")
);
