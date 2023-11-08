/*
  Warnings:

  - You are about to drop the column `blueprint_id` on the `blueprint_fields` table. All the data in the column will be lost.
  - You are about to drop the column `calendar_id` on the `blueprint_fields` table. All the data in the column will be lost.
  - You are about to drop the column `random_table_id` on the `blueprint_fields` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blueprint_fields" DROP COLUMN "blueprint_id",
DROP COLUMN "calendar_id",
DROP COLUMN "random_table_id";
