/*
  Warnings:

  - Made the column `calendar_id` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "calendar_id" SET NOT NULL;
