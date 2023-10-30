/*
  Warnings:

  - Added the required column `width` to the `blueprint_fields` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldWidth" AS ENUM ('half', 'full');

-- AlterTable
ALTER TABLE "blueprint_fields" ADD COLUMN     "width" "FieldWidth" NOT NULL;
