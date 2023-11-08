-- AlterTable
ALTER TABLE "blueprint_instance_random_tables" ADD COLUMN     "option_id" TEXT,
ADD COLUMN     "suboption_id" TEXT;

-- AddForeignKey
ALTER TABLE "blueprint_instance_random_tables" ADD CONSTRAINT "blueprint_instance_random_tables_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "random_table_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_random_tables" ADD CONSTRAINT "blueprint_instance_random_tables_suboption_id_fkey" FOREIGN KEY ("suboption_id") REFERENCES "random_table_suboptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
