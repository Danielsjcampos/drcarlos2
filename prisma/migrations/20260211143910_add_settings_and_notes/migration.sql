-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "siteName" TEXT NOT NULL DEFAULT 'Sport Health',
    "titleTemplate" TEXT NOT NULL DEFAULT '%s | Sport Health',
    "description" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "addressCity" TEXT,
    "addressRegion" TEXT,
    "addressPostalCode" TEXT,
    "logoUrl" TEXT,
    "iconUrl" TEXT,
    "instagramUrl" TEXT,
    "whatsappUrl" TEXT,
    "ogImage" TEXT,
    "twitterHandle" TEXT,
    "themeColor" TEXT NOT NULL DEFAULT '#0a4d2c',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
