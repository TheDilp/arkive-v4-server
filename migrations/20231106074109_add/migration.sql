-- CreateTable
CREATE TABLE "blueprint_instance_value" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "blueprint_instance_value_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id")
);

-- AddForeignKey
ALTER TABLE "blueprint_instance_value" ADD CONSTRAINT "blueprint_instance_value_blueprint_instance_id_fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_value" ADD CONSTRAINT "blueprint_instance_value_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
