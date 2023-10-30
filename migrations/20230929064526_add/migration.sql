/*
  Warnings:

  - The primary key for the `characters_relationships` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "characters_relationships" DROP CONSTRAINT "characters_relationships_pkey",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "characters_relationships_pkey" PRIMARY KEY ("id");
