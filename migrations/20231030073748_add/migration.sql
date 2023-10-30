/*
  Warnings:

  - You are about to drop the column `icon` on the `blueprint_instances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blueprint_instances" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "blueprints" ADD COLUMN     "icon" TEXT;
