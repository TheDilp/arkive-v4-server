/*
  Warnings:

  - You are about to drop the column `relation_type` on the `characters_relationships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "characters_relationships" DROP COLUMN "relation_type",
ADD COLUMN     "relation_type_id" TEXT;

-- AddForeignKey
ALTER TABLE "characters_relationships" ADD CONSTRAINT "characters_relationships_relation_type_id_fkey" FOREIGN KEY ("relation_type_id") REFERENCES "character_relationship_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
