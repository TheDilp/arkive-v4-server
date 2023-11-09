-- AlterTable
ALTER TABLE "blueprint_fields" ADD COLUMN     "calendar_id" TEXT;

-- AddForeignKey
ALTER TABLE "blueprint_fields" ADD CONSTRAINT "blueprint_fields_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
