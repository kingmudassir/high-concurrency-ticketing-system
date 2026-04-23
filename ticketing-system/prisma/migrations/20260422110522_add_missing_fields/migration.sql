/*
    Warnings:

    - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.
    - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
    - Added the required column `pricePaid` to the `Ticket` table without a default value. This is not possible if the table is not empty.
    - Added the required column `tierId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
*/

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'ENDED');

-- CreateEnum
CREATE TYPE "LineupRole" AS ENUM ('HEADLINER', 'SUPPORT', 'OPENER', 'SPECIAL_GUEST');

-- Handle existing data - delete old tickets if any (optional, only if you have existing tickets)
-- TRUNCATE TABLE "Ticket" CASCADE;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "price",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'concert',  -- Added DEFAULT
ADD COLUMN     "city" TEXT,
ADD COLUMN     "doorsOpen" TIMESTAMP(3),
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "gstPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "instructions" TEXT[],
ADD COLUMN     "parking" TEXT,
ADD COLUMN     "serviceFeePercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "transport" TEXT,
ADD COLUMN     "venueNotes" TEXT,
ALTER COLUMN "totalTickets" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "gstPaid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pricePaid" INTEGER NOT NULL DEFAULT 0,  -- Added DEFAULT
ADD COLUMN     "serviceFeePaid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tierId" TEXT;  -- Made optional temporarily

-- Now update existing tickets to have a valid tierId (if any exist)
-- You'll need to create a default tier or handle this based on your data

-- CreateTable
CREATE TABLE "TicketTier" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineupAct" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "LineupRole" NOT NULL,
    "startTime" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LineupAct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineupAct" ADD CONSTRAINT "LineupAct_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "TicketTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- After migration, if you have existing tickets, you'll need to set tierId to a valid value
-- You can run a script or manually update them