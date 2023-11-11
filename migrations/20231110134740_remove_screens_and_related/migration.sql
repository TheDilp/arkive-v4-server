/*
  Warnings:

  - You are about to drop the `_cardsTotags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_screensTotags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `screens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_cardsTotags" DROP CONSTRAINT "_cardsTotags_A_fkey";

-- DropForeignKey
ALTER TABLE "_cardsTotags" DROP CONSTRAINT "_cardsTotags_B_fkey";

-- DropForeignKey
ALTER TABLE "_screensTotags" DROP CONSTRAINT "_screensTotags_A_fkey";

-- DropForeignKey
ALTER TABLE "_screensTotags" DROP CONSTRAINT "_screensTotags_B_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_document_id_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "screens" DROP CONSTRAINT "screens_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "screens" DROP CONSTRAINT "screens_project_id_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_parent_id_fkey";

-- DropTable
DROP TABLE "_cardsTotags";

-- DropTable
DROP TABLE "_screensTotags";

-- DropTable
DROP TABLE "cards";

-- DropTable
DROP TABLE "screens";

-- DropTable
DROP TABLE "sections";
