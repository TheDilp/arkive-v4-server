/*
  Warnings:

  - The `options` column on the `character_fields` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "character_fields" DROP COLUMN "options",
ADD COLUMN     "options" JSONB;
