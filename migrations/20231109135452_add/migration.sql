-- AlterTable
ALTER TABLE "blueprint_instance_calendars" ADD COLUMN     "end_month_id" TEXT,
ADD COLUMN     "start_month_id" TEXT;

-- AddForeignKey
ALTER TABLE "blueprint_instance_calendars" ADD CONSTRAINT "blueprint_instance_calendars_start_month_id_fkey" FOREIGN KEY ("start_month_id") REFERENCES "months"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_calendars" ADD CONSTRAINT "blueprint_instance_calendars_end_month_id_fkey" FOREIGN KEY ("end_month_id") REFERENCES "months"("id") ON DELETE SET NULL ON UPDATE CASCADE;
