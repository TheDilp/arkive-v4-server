/*
  Warnings:

  - Added the required column `ascendant_title` to the `character_relationship_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descendant_title` to the `character_relationship_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "character_relationship_types" ADD COLUMN     "ascendant_title" TEXT NOT NULL,
ADD COLUMN     "descendant_title" TEXT NOT NULL;
