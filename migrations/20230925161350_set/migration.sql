-- DropForeignKey
ALTER TABLE "map_layers" DROP CONSTRAINT "map_layers_image_id_fkey";

-- AddForeignKey
ALTER TABLE "map_layers" ADD CONSTRAINT "map_layers_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
