/*
  Warnings:

  - You are about to drop the column `width` on the `blueprint_fields` table. All the data in the column will be lost.
  - You are about to drop the column `title_width` on the `blueprints` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blueprint_fields" DROP COLUMN "width";

-- AlterTable
ALTER TABLE "blueprints" DROP COLUMN "title_width";
