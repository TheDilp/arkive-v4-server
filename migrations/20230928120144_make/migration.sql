/*
  Warnings:

  - A unique constraint covering the columns `[project_id,title]` on the table `character_relationship_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "character_relationship_types_project_id_title_key" ON "character_relationship_types"("project_id", "title");
