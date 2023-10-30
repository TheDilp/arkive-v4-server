/*
  Warnings:

  - You are about to drop the column `blueprint_id` on the `blueprint_fields` table. All the data in the column will be lost.
  - You are about to drop the column `blueprint_id` on the `blueprint_instances` table. All the data in the column will be lost.
  - Added the required column `parent_id` to the `blueprint_instances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blueprint_instances" DROP CONSTRAINT "blueprint_instances_blueprint_id_fkey";

-- AlterTable
ALTER TABLE "blueprint_fields" DROP COLUMN "blueprint_id";

-- AlterTable
ALTER TABLE "blueprint_instances" DROP COLUMN "blueprint_id",
ADD COLUMN     "parent_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "blueprint_instances" ADD CONSTRAINT "blueprint_instances_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
