/*
  Warnings:

  - You are about to drop the `_characters_to_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_characters_to_images" DROP CONSTRAINT "_characters_to_images_A_fkey";

-- DropForeignKey
ALTER TABLE "_characters_to_images" DROP CONSTRAINT "_characters_to_images_B_fkey";

-- DropTable
DROP TABLE "_characters_to_images";

-- CreateTable
CREATE TABLE "_charactersToimages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_charactersToimages_AB_unique" ON "_charactersToimages"("A", "B");

-- CreateIndex
CREATE INDEX "_charactersToimages_B_index" ON "_charactersToimages"("B");

-- AddForeignKey
ALTER TABLE "_charactersToimages" ADD CONSTRAINT "_charactersToimages_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_charactersToimages" ADD CONSTRAINT "_charactersToimages_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
