-- CreateTable
CREATE TABLE "appcompany"."TeamSectionMeta" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT 'The People Behind The Curry',
    "headingLine1" TEXT NOT NULL DEFAULT 'MEET THE',
    "headingLine2" TEXT NOT NULL DEFAULT 'TEAM',
    "heroImage" TEXT NOT NULL DEFAULT '/images/chef.jpg',
    "heroTagline1" TEXT NOT NULL DEFAULT 'The People Who Make',
    "heroTagline2" TEXT NOT NULL DEFAULT 'Every Bowl Perfect',
    "ctaTitle" TEXT NOT NULL DEFAULT 'JOIN OUR TEAM',
    "ctaDesc" TEXT NOT NULL DEFAULT 'Passionate about food? We''re always looking for talented people who share our obsession.',
    "ctaButtonLabel" TEXT NOT NULL DEFAULT 'Get In Touch',
    "ctaButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamSectionMeta_pkey" PRIMARY KEY ("id")
);
