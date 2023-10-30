/*
  Warnings:

  - Added the required column `type` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('text', 'select', 'select_multiple', 'dice_roll', 'date', 'random_table', 'documents_single', 'documents_multiple', 'images_single', 'images_multiple', 'locations_single', 'locations_multiple');

-- CreateEnum
CREATE TYPE "ConversationMessageType" AS ENUM ('Character', 'Info');

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "type" "ConversationMessageType" NOT NULL,
ALTER COLUMN "sender_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
