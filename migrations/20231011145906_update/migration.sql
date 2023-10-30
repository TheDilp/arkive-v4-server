/*
  Warnings:

  - The values [Character,Info] on the enum `ConversationMessageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConversationMessageType_new" AS ENUM ('character', 'narration', 'place');
ALTER TABLE "messages" ALTER COLUMN "type" TYPE "ConversationMessageType_new" USING ("type"::text::"ConversationMessageType_new");
ALTER TYPE "ConversationMessageType" RENAME TO "ConversationMessageType_old";
ALTER TYPE "ConversationMessageType_new" RENAME TO "ConversationMessageType";
DROP TYPE "ConversationMessageType_old";
COMMIT;
