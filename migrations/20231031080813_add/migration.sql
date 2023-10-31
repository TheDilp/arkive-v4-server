/*
  Warnings:

  - You are about to drop the column `show_image_folder_view` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `show_image_table_view` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "show_image_folder_view",
DROP COLUMN "show_image_table_view";

-- CreateTable
CREATE TABLE "_project_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_project_members_AB_unique" ON "_project_members"("A", "B");

-- CreateIndex
CREATE INDEX "_project_members_B_index" ON "_project_members"("B");

-- AddForeignKey
ALTER TABLE "_project_members" ADD CONSTRAINT "_project_members_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_project_members" ADD CONSTRAINT "_project_members_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
