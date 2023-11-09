-- CreateTable
CREATE TABLE "blueprint_instance_blueprint_instances" (
    "blueprint_instance_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "related_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_instance_blueprint_instances_pkey" PRIMARY KEY ("blueprint_instance_id","blueprint_field_id","related_id")
);

-- AddForeignKey
ALTER TABLE "blueprint_instance_blueprint_instances" ADD CONSTRAINT "blueprint_instance_blueprint_instances_blueprint_instance__fkey" FOREIGN KEY ("blueprint_instance_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_blueprint_instances" ADD CONSTRAINT "blueprint_instance_blueprint_instances_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instance_blueprint_instances" ADD CONSTRAINT "blueprint_instance_blueprint_instances_related_id_fkey" FOREIGN KEY ("related_id") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
