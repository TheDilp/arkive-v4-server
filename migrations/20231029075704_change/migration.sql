/*
  Warnings:

  - Changed the type of `field_type` on the `blueprint_fields` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BlueprintFieldType" AS ENUM ('text', 'select', 'select_multiple', 'dice_roll', 'date', 'random_table', 'documents_single', 'documents_multiple', 'images_single', 'images_multiple', 'locations_single', 'locations_multiple', 'characters_single', 'characters_multiple');

-- AlterTable
ALTER TABLE "blueprint_fields" DROP COLUMN "field_type",
ADD COLUMN     "field_type" "BlueprintFieldType" NOT NULL;
