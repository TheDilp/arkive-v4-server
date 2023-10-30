-- DropForeignKey
ALTER TABLE "blueprint_instances" DROP CONSTRAINT "blueprint_instances_blueprint_id_fkey";

-- DropForeignKey
ALTER TABLE "blueprints" DROP CONSTRAINT "blueprints_project_id_fkey";

-- DropForeignKey
ALTER TABLE "character_fields" DROP CONSTRAINT "character_fields_project_id_fkey";

-- DropForeignKey
ALTER TABLE "character_fields_templates" DROP CONSTRAINT "character_fields_templates_project_id_fkey";

-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_project_id_fkey";

-- DropForeignKey
ALTER TABLE "webhooks" DROP CONSTRAINT "webhooks_user_id_fkey";

-- AddForeignKey
ALTER TABLE "blueprints" ADD CONSTRAINT "blueprints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blueprint_instances" ADD CONSTRAINT "blueprint_instances_blueprint_id_fkey" FOREIGN KEY ("blueprint_id") REFERENCES "blueprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_fields" ADD CONSTRAINT "character_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_fields_templates" ADD CONSTRAINT "character_fields_templates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
