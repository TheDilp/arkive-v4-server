/*
  Warnings:

  - You are about to drop the column `year` on the `events` table. All the data in the column will be lost.
  - Added the required column `startMonth` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_month_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "year",
ADD COLUMN     "endMonth" INTEGER,
ADD COLUMN     "endYear" INTEGER,
ADD COLUMN     "startMonth" INTEGER NOT NULL,
ADD COLUMN     "startYear" INTEGER NOT NULL;
