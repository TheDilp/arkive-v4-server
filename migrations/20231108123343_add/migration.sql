-- AlterTable
ALTER TABLE "blueprint_fields" ADD COLUMN     "random_table_id" TEXT;

-- AddForeignKey
ALTER TABLE "blueprint_fields" ADD CONSTRAINT "blueprint_fields_random_table_id_fkey" FOREIGN KEY ("random_table_id") REFERENCES "random_tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
