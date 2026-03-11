-- CreateTable
CREATE TABLE "appcompany"."ContactFormContent" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT 'Our Information',
    "headingLine1" TEXT NOT NULL DEFAULT 'VISIT US',
    "headingLine2" TEXT NOT NULL DEFAULT 'ANYTIME',
    "locationLines" TEXT[],
    "hoursLines" TEXT[],
    "phoneLines" TEXT[],
    "emailLines" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactFormContent_pkey" PRIMARY KEY ("id")
);
