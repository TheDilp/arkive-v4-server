/*
  Warnings:

  - Changed the type of `field_type` on the `blueprint_fields` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "blueprint_fields" DROP COLUMN "field_type",
ADD COLUMN     "field_type" "FieldType" NOT NULL;
