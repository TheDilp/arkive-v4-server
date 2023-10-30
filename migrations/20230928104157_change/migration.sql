/*
  Warnings:

  - The primary key for the `characters_relationships` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `relation_type_id` on table `characters_relationships` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "characters_relationships" DROP CONSTRAINT "characters_relationships_pkey",
ALTER COLUMN "relation_type_id" SET NOT NULL,
ADD CONSTRAINT "characters_relationships_pkey" PRIMARY KEY ("character_a_id", "character_b_id", "relation_type_id");
