/*
  Warnings:

  - You are about to drop the column `calendar_id` on the `events` table. All the data in the column will be lost.
  - Added the required column `parent_id` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_calendar_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "calendar_id",
ADD COLUMN     "parent_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
