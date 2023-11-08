/*
  Warnings:

  - The primary key for the `blueprint_instance_characters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `character_id` on the `blueprint_instance_characters` table. All the data in the column will be lost.
  - The primary key for the `blueprint_instance_documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `document_id` on the `blueprint_instance_documents` table. All the data in the column will be lost.
  - The primary key for the `blueprint_instance_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image_id` on the `blueprint_instance_images` table. All the data in the column will be lost.
  - The primary key for the `blueprint_instance_map_pins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `map_pin_id` on the `blueprint_instance_map_pins` table. All the data in the column will be lost.
  - The primary key for the `blueprint_instance_random_tables` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `random_table_id` on the `blueprint_instance_random_tables` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blueprint_instance_id,blueprint_field_id,related_id]` on the table `blueprint_instance_random_tables` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `related_id` to the `blueprint_instance_characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `related_id` to the `blueprint_instance_documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `related_id` to the `blueprint_instance_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `related_id` to the `blueprint_instance_map_pins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `related_id` to the `blueprint_instance_random_tables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blueprint_instance_characters" DROP CONSTRAINT "blueprint_instance_characters_character_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_instance_documents" DROP CONSTRAINT "blueprint_instance_documents_document_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_instance_images" DROP CONSTRAINT "blueprint_instance_images_image_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_instance_map_pins" DROP CONSTRAINT "blueprint_instance_map_pins_map_pin_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_instance_random_tables" DROP CONSTRAINT "blueprint_instance_random_tables_random_table_id_fkey";

-- DropIndex
DROP INDEX "blueprint_instance_random_tables_blueprint_instance_id_blue_key";

-- AlterTable
ALTER TABLE "blueprint_instance_characters" DROP CONSTRAINT "blueprint_instance_characters_pkey",
DROP COLUMN "character_id",
ADD COLUMN     "related_id" TEXT NOT NULL,
ADD CONSTRAINT "blueprint_instance_characters_pkey" PRIMARY KEY ("blueprint_instance_id", "blueprint_field_id", "related_id");

-- AlterTable
ALTER TABLE "blueprint_instance_documents" DROP CONSTRAINT "blueprint_instance_documents_pkey",
DROP COLUMN "document_id",
ADD COLUMN     "related_id" TEXT NOT NULL,
ADD CONSTRAINT "blueprint_instance_documents_pkey" PRIMARY KEY ("blueprint_instance_id", "blueprint_field_id", "related_id");

-- AlterTable
ALTER TABLE "blueprint_instance_images" DROP CONSTRAINT "blueprint_instance_images_pkey",
DROP COLUMN "image_id",
ADD COLUMN     "related_id" TEXT NOT NULL,
ADD CONSTRAINT "blueprint_instance_images_pkey" PRIMARY KEY ("blueprint_instance_id", "blueprint_field_id", "related_id");

-- AlterTable
ALTER TABLE "blueprint_instance_map_pins" DROP CONSTRAINT "blueprint_instance_map_pins_pkey",
DROP COLUMN "map_pin_id",
ADD COLUMN     "related_id" TEXT NOT NULL,
ADD CONSTRAINT "blueprint_instance_map_pins_pkey" PRIMARY KEY ("blueprint_instance_id", "blueprint_field_id", "related_id");

-- AlterTable
ALTER TABLE "blueprint_instance_random_tables" DROP CONSTRAINT "blueprint_instance_random_tables_pkey",
DROP COLUMN "random_table_id",
ADD COLUMN     "related_id" TEXT NOT NULL,
ADD CONSTRAINT "blueprint_instance_random_tables_pkey" PRIMARY KEY ("blueprint_instance_id", "blueprint_field_id", "related_id");

-- CreateIndex
CREATE UNIQUE INDEX "blueprint_instance_random_tables_blueprint_instance_id_blue_key" ON "blueprint_instance_random_tables"("blueprint_instance_id", "blueprint_field_id", "related_id");

-- AddForeignKey
ALTER TABLE "blueprint_instance_characters" ADD CONSTRAINT "blueprint_instance_characters_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_documents" ADD CONSTRAINT "blueprint_instance_documents_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_map_pins" ADD CONSTRAINT "blueprint_instance_map_pins_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "map_pins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_images" ADD CONSTRAINT "blueprint_instance_images_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_random_tables" ADD CONSTRAINT "blueprint_instance_random_tables_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "random_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
