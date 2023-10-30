/*
  Warnings:

  - You are about to drop the column `map_id` on the `characters` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_map_id_fkey";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "map_id";

-- CreateTable
CREATE TABLE "_charactersTomaps" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_charactersTomaps_AB_unique" ON "_charactersTomaps"("A", "B");

-- CreateIndex
CREATE INDEX "_charactersTomaps_B_index" ON "_charactersTomaps"("B");

-- AddForeignKey
ALTER TABLE "_charactersTomaps" ADD CONSTRAINT "_charactersTomaps_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_charactersTomaps" ADD CONSTRAINT "_charactersTomaps_B_fkey" FOREIGN KEY ("B") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
