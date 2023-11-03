/*
  Warnings:

  - You are about to drop the column `value` on the `blueprint_instances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blueprint_instances" DROP COLUMN "value";

-- CreateTable
CREATE TABLE "blueprint_instance_to_blueprint_fields" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "blueprint_instance_to_blueprint_fields_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id")
);

-- AddForeignKey
ALTER TABLE "blueprint_instance_to_blueprint_fields" ADD CONSTRAINT "blueprint_instance_to_blueprint_fields_blueprint_instance__fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_to_blueprint_fields" ADD CONSTRAINT "blueprint_instance_to_blueprint_fields_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
