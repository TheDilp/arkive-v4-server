/*
  Warnings:

  - You are about to drop the column `endDay` on the `blueprint_instance_calendars` table. All the data in the column will be lost.
  - You are about to drop the column `endYear` on the `blueprint_instance_calendars` table. All the data in the column will be lost.
  - You are about to drop the column `startDay` on the `blueprint_instance_calendars` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `blueprint_instance_calendars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blueprint_instance_calendars" DROP COLUMN "endDay",
DROP COLUMN "endYear",
DROP COLUMN "startDay",
DROP COLUMN "startYear",
ADD COLUMN     "end_day" INTEGER,
ADD COLUMN     "end_year" INTEGER,
ADD COLUMN     "start_day" INTEGER,
ADD COLUMN     "start_year" INTEGER;
