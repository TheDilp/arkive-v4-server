/*
  Warnings:

  - Made the column `show_image_folder_view` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `show_image_table_view` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "show_image_folder_view" SET NOT NULL,
ALTER COLUMN "show_image_folder_view" SET DEFAULT true,
ALTER COLUMN "show_image_table_view" SET NOT NULL,
ALTER COLUMN "show_image_table_view" SET DEFAULT true;
