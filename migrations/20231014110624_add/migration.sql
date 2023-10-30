-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('viewer', 'editor', 'owner');

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "content" JSONB;

-- AlterTable
ALTER TABLE "screens" ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "section_size" DROP NOT NULL,
ALTER COLUMN "section_size" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sections" ALTER COLUMN "card_size" DROP NOT NULL,
ALTER COLUMN "card_size" DROP DEFAULT;
