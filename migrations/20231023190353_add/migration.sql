/*
  Warnings:

  - The `type` column on the `images` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('images', 'map_images');

-- AlterTable
ALTER TABLE "images" DROP COLUMN "type",
ADD COLUMN     "type" "ImageType" NOT NULL DEFAULT 'images';
