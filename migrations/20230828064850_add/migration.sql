-- CreateTable
CREATE TABLE "blueprint_fields" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "field_type" TEXT NOT NULL,
    "options" TEXT[],
    "formula" TEXT,
    "random_table_id" TEXT,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "blueprint_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_template" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "blueprint_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprints" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "blueprint_template_id" TEXT NOT NULL,

    CONSTRAINT "blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blueprint_to_blueprint_fields" (
    "blueprint_id" TEXT NOT NULL,
    "blueprint_field_id" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "blueprint_to_blueprint_fields_pkey" PRIMARY KEY ("blueprint_id","blueprint_field_id")
);

-- AddForeignKey
ALTER TABLE "blueprint_fields" ADD CONSTRAINT "blueprint_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_fields" ADD CONSTRAINT "blueprint_fields_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "blueprint_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_template" ADD CONSTRAINT "blueprint_template_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprints" ADD CONSTRAINT "blueprints_blueprint_template_id_fkey" FOREIGN KEY ("blueprint_template_id") REFERENCES "blueprint_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_to_blueprint_fields" ADD CONSTRAINT "blueprint_to_blueprint_fields_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_to_blueprint_fields" ADD CONSTRAINT "blueprint_to_blueprint_fields_blueprint_field_id_fkey" FOREIGN KEY ("blueprint_field_id") REFERENCES "blueprint_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
