/*
  Warnings:

  - You are about to drop the column `blueprint_template_id` on the `blueprints` table. All the data in the column will be lost.
  - You are about to drop the `blueprint_fields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blueprint_template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blueprint_to_blueprint_fields` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_id` to the `blueprints` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blueprint_fields" DROP CONSTRAINT "blueprint_fields_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_fields" DROP CONSTRAINT "blueprint_fields_project_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_template" DROP CONSTRAINT "blueprint_template_project_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_to_blueprint_fields" DROP CONSTRAINT "blueprint_to_blueprint_fields_blueprint_field_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprint_to_blueprint_fields" DROP CONSTRAINT "blueprint_to_blueprint_fields_blueprint_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprints" DROP CONSTRAINT "blueprints_blueprint_template_id_fkey";

-- AlterTable
ALTER TABLE "blueprints" DROP COLUMN "blueprint_template_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "character_fields" ADD COLUMN     "blueprintsId" TEXT;

-- DropTable
DROP TABLE "blueprint_fields";

-- DropTable
DROP TABLE "blueprint_template";

-- DropTable
DROP TABLE "blueprint_to_blueprint_fields";

-- AddForeignKey
ALTER TABLE "blueprints" ADD CONSTRAINT "blueprints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_fields" ADD CONSTRAINT "character_fields_blueprintsId_fkey" FOREIGN KEY ("blueprintsId") REFERENCES "blueprints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
