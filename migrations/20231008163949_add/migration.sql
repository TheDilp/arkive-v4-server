-- CreateTable
CREATE TABLE "blueprint_instance" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blueprint_id" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "blueprint_instance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blueprint_instance" ADD CONSTRAINT "blueprint_instance_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
