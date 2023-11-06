/*
  Warnings:

  - You are about to drop the `blueprint_instance_to_blueprint_fields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blueprint_instance_to_blueprint_fields" DROP CONSTRAINT "blueprint_instance_to_blueprint_fields_blueprint_field_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_instance_to_blueprint_fields" DROP CONSTRAINT "blueprint_instance_to_blueprint_fields_blueprint_instance__fkey";

-- DropTable
DROP TABLE "blueprint_instance_to_blueprint_fields";

-- CreateTable
CREATE TABLE "blueprint_instance_characters" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_characters_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","character_id")
);

-- CreateTable
CREATE TABLE "blueprint_instance_documents" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_documents_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","document_id")
);

-- CreateTable
CREATE TABLE "blueprint_instance_map_pins" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "map_pin_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_map_pins_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","map_pin_id")
);

-- CreateTable
CREATE TABLE "blueprint_instance_images" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_images_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","image_id")
);

-- CreateTable
CREATE TABLE "blueprint_instance_random_tables" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "random_table_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_random_tables_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","random_table_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blueprint_instance_random_tables_blueprint_instance_id_blue_key" ON "blueprint_instance_random_tables"("blueprint_instance_id", "blueprint_field_id", "random_table_id");

-- AddForeignKey
ALTER TABLE "blueprint_instance_characters" ADD CONSTRAINT "blueprint_instance_characters_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_characters" ADD CONSTRAINT "blueprint_instance_characters_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_characters" ADD CONSTRAINT "blueprint_instance_characters_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_documents" ADD CONSTRAINT "blueprint_instance_documents_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_documents" ADD CONSTRAINT "blueprint_instance_documents_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_documents" ADD CONSTRAINT "blueprint_instance_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_map_pins" ADD CONSTRAINT "blueprint_instance_map_pins_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_map_pins" ADD CONSTRAINT "blueprint_instance_map_pins_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_map_pins" ADD CONSTRAINT "blueprint_instance_map_pins_map_pin_id_fkey" FOREIGN KEY ("map_pin_id") REFERENCES "map_pins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_images" ADD CONSTRAINT "blueprint_instance_images_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_images" ADD CONSTRAINT "blueprint_instance_images_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_images" ADD CONSTRAINT "blueprint_instance_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_random_tables" ADD CONSTRAINT "blueprint_instance_random_tables_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_random_tables" ADD CONSTRAINT "blueprint_instance_random_tables_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_random_tables" ADD CONSTRAINT "blueprint_instance_random_tables_random_table_id_fkey" FOREIGN KEY ("random_table_id") REFERENCES "random_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
