/*
  Warnings:

  - You are about to drop the column `conversation_id` on the `messages` table. All the data in the column will be lost.
  - Added the required column `parent_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversation_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversation_id",
ADD COLUMN     "parent_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
