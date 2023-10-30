/*
  Warnings:

  - You are about to drop the column `blueprint_id` on the `character_fields` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `character_fields` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "character_fields" DROP CONSTRAINT "character_fields_blueprint_id_fkey";

-- DropForeignKey
ALTER TABLE "character_fields" DROP CONSTRAINT "character_fields_project_id_fkey";

-- AlterTable
ALTER TABLE "character_fields" DROP COLUMN "blueprint_id",
DROP COLUMN "project_id";

-- CreateTable
CREATE TABLE "blueprint_fields" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "field_type" TEXT NOT NULL,
    "options" JSONB,
    "formula" TEXT,
    "random_table_id" TEXT,
    "calendar_id" TEXT,
    "parent_id" TEXT,
    "blueprint_id" TEXT,

    CONSTRAINT "blueprint_fields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blueprint_fields" ADD CONSTRAINT "blueprint_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_fields" ADD CONSTRAINT "blueprint_fields_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
