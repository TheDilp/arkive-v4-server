/*
  Warnings:

  - You are about to drop the `_charactersTomaps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_charactersTomaps" DROP CONSTRAINT "_charactersTomaps_A_fkey";

-- DropForeignKey
ALTER TABLE "_charactersTomaps" DROP CONSTRAINT "_charactersTomaps_B_fkey";

-- AlterTable
ALTER TABLE "map_pins" ADD COLUMN     "character_id" TEXT;

-- DropTable
DROP TABLE "_charactersTomaps";
