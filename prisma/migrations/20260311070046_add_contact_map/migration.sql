-- CreateTable
CREATE TABLE "appcompany"."ContactMapContent" (
    "id" TEXT NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL DEFAULT -6.8,
    "centerLng" DOUBLE PRECISION NOT NULL DEFAULT 107.5,
    "zoom" INTEGER NOT NULL DEFAULT 8,
    "markers" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMapContent_pkey" PRIMARY KEY ("id")
);
