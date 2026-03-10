-- CreateTable
CREATE TABLE "appcompany"."OurValuesContent" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT 'What We Stand For',
    "headingLine1" TEXT NOT NULL DEFAULT 'OUR',
    "headingLine2" TEXT NOT NULL DEFAULT 'VALUES',
    "values" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OurValuesContent_pkey" PRIMARY KEY ("id")
);
