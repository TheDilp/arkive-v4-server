/*
  Warnings:

  - You are about to drop the column `endDay` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `endMonth` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `endYear` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startDay` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startMonth` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `events` table. All the data in the column will be lost.
  - Added the required column `start_day` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_month` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_year` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "endDay",
DROP COLUMN "endMonth",
DROP COLUMN "endYear",
DROP COLUMN "startDay",
DROP COLUMN "startMonth",
DROP COLUMN "startYear",
ADD COLUMN     "end_day" INTEGER,
ADD COLUMN     "end_month" INTEGER,
ADD COLUMN     "end_year" INTEGER,
ADD COLUMN     "start_day" INTEGER NOT NULL,
ADD COLUMN     "start_month" INTEGER NOT NULL,
ADD COLUMN     "start_year" INTEGER NOT NULL;
