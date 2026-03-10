-- CreateTable
CREATE TABLE "appcompany"."OurStoryContent" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT 'How It All Started',
    "headingLine1" TEXT NOT NULL DEFAULT 'FROM A HOME',
    "headingLine2" TEXT NOT NULL DEFAULT 'KITCHEN TO',
    "headingLine3" TEXT NOT NULL DEFAULT 'THE WORLD',
    "paragraph1" TEXT NOT NULL DEFAULT 'It started in 2020 when our founder spent an entire weekend perfecting his grandmother''s curry recipe. After 100 hours of slow cooking, he discovered something magical — depth of flavor that no shortcut could ever replicate.',
    "paragraph2" TEXT NOT NULL DEFAULT 'What began as a passion project shared with friends quickly grew into Jakarta''s most talked-about curry destination. Word spread not through ads, but through the irresistible aroma and unforgettable taste.',
    "paragraph3" TEXT NOT NULL DEFAULT 'Today, we still follow the same 100-hour process. No compromises. No shortcuts. Just pure, obsessive dedication to the perfect bowl of curry.',
    "stat1Value" TEXT NOT NULL DEFAULT '2020',
    "stat1Label" TEXT NOT NULL DEFAULT 'Founded',
    "stat2Value" TEXT NOT NULL DEFAULT '3',
    "stat2Label" TEXT NOT NULL DEFAULT 'Locations',
    "stat3Value" TEXT NOT NULL DEFAULT '50K+',
    "stat3Label" TEXT NOT NULL DEFAULT 'Bowls Served',
    "hoursValue" TEXT NOT NULL DEFAULT '100',
    "hoursLabel1" TEXT NOT NULL DEFAULT 'Hours of dedication',
    "hoursLabel2" TEXT NOT NULL DEFAULT 'in every single bowl',
    "imageUrl" TEXT DEFAULT '/images/MAINDISH/AI1.png',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OurStoryContent_pkey" PRIMARY KEY ("id")
);
