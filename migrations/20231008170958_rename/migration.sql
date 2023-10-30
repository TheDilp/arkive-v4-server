/*
  Warnings:

  - You are about to drop the `blueprint_instance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blueprint_instance" DROP CONSTRAINT "blueprint_instance_blueprint_id_fkey";

-- DropTable
DROP TABLE "blueprint_instance";

-- CreateTable
CREATE TABLE "blueprint_instances" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blueprint_id" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "blueprint_instances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blueprint_instances" ADD CONSTRAINT "blueprint_instances_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
