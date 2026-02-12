/*
  Warnings:

  - A unique constraint covering the columns `[accessCode]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "accessCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_accessCode_key" ON "Lead"("accessCode");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
