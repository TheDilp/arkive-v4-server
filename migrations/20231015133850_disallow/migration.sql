/*
  Warnings:

  - Made the column `content` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "content" SET NOT NULL;
