-- CreateTable
CREATE TABLE "blueprint_instance_calendars" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "related_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_calendars_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","related_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blueprint_instance_calendars_blueprint_instance_id_blueprin_key" ON "blueprint_instance_calendars"("blueprint_instance_id", "blueprint_field_id", "related_id");

-- AddForeignKey
ALTER TABLE "blueprint_instance_calendars" ADD CONSTRAINT "blueprint_instance_calendars_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_calendars" ADD CONSTRAINT "blueprint_instance_calendars_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_calendars" ADD CONSTRAINT "blueprint_instance_calendars_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
