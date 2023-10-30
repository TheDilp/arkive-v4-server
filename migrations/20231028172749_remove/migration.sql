/*
  Warnings:

  - You are about to drop the column `project_id` on the `blueprint_fields` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "blueprint_fields" DROP CONSTRAINT "blueprint_fields_project_id_fkey";

-- AlterTable
ALTER TABLE "blueprint_fields" DROP COLUMN "project_id";
