/*
  Warnings:

  - Added the required column `title` to the `blueprint_instances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_name` to the `blueprints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blueprint_instances" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "blueprints" ADD COLUMN     "title_name" TEXT NOT NULL,
ADD COLUMN     "title_width" "FieldWidth" NOT NULL DEFAULT 'full';
