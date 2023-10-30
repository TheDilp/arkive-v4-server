/*
  Warnings:

  - You are about to drop the column `blueprintsId` on the `character_fields` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "character_fields" DROP CONSTRAINT "character_fields_blueprintsId_fkey";

-- AlterTable
ALTER TABLE "character_fields" DROP COLUMN "blueprintsId",
ADD COLUMN     "blueprint_id" TEXT;

-- AddForeignKey
ALTER TABLE "character_fields" ADD CONSTRAINT "character_fields_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
