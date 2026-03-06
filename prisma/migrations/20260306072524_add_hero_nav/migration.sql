-- CreateTable
CREATE TABLE "appcompany"."HeroContent" (
    "id" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT 'SIMMERED FOR 100 HOURS',
    "headingLine1" TEXT NOT NULL DEFAULT 'THE MOST',
    "headingLine2" TEXT NOT NULL DEFAULT 'LEGENDARY',
    "headingLine3" TEXT NOT NULL DEFAULT 'CURRY',
    "subtitle" TEXT NOT NULL DEFAULT 'Every bowl is a masterpiece.',
    "estYear" TEXT NOT NULL DEFAULT '2020',
    "stat1Value" TEXT NOT NULL DEFAULT '100',
    "stat1Label" TEXT NOT NULL DEFAULT 'Hours Cooked',
    "stat1Suffix" TEXT NOT NULL DEFAULT 'hrs',
    "stat2Value" TEXT NOT NULL DEFAULT '4.9',
    "stat2Label" TEXT NOT NULL DEFAULT 'Rating',
    "stat2Suffix" TEXT NOT NULL DEFAULT '★',
    "stat3Value" TEXT NOT NULL DEFAULT '50K+',
    "stat3Label" TEXT NOT NULL DEFAULT 'Bowls Served',
    "stat3Suffix" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appcompany"."AdminNavItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "href" TEXT,
    "groupName" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appcompany"."AdminNavChild" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNavChild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appcompany"."AdminNavChild" ADD CONSTRAINT "AdminNavChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "appcompany"."AdminNavItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
