-- CreateTable
CREATE TABLE "appcompany"."CtaSection" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT 'COME FIND US',
    "headline1" TEXT NOT NULL DEFAULT 'ONE BOWL.',
    "headline2" TEXT NOT NULL DEFAULT 'FOREVER.',
    "description" TEXT NOT NULL DEFAULT 'A curry so carefully crafted, one visit is all it takes to make you a regular.',
    "address" TEXT NOT NULL DEFAULT 'Jl. Kuliner No. 1, Jakarta Selatan',
    "hours" TEXT NOT NULL DEFAULT 'Open Daily: 11:00 AM – 10:00 PM',
    "phone" TEXT NOT NULL DEFAULT '+62 21 1234 5678',
    "buttonLabel" TEXT NOT NULL DEFAULT 'Get Directions',
    "features" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CtaSection_pkey" PRIMARY KEY ("id")
);
