/*
  Warnings:

  - Made the column `tierId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "category" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "pricePaid" DROP DEFAULT,
ALTER COLUMN "tierId" SET NOT NULL;
