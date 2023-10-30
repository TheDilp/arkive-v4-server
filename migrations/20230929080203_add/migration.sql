/*
  Warnings:

  - A unique constraint covering the columns `[character_a_id,character_b_id,relation_type_id]` on the table `characters_relationships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "characters_relationships_character_a_id_character_b_id_rela_key" ON "characters_relationships"("character_a_id", "character_b_id", "relation_type_id");
