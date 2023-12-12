-- migrate:up
CREATE TYPE "MentionTypeEnum" AS ENUM (
    'characters', 'documents', 'maps', 'graphs', 'blueprint_instances', 'words', 'events'
);
ALTER TABLE document_mentions ADD COLUMN mention_type public."MentionTypeEnum" NOT NULL;


-- migrate:down
ALTER TABLE document_mentions DROP COLUMN mention_type;
DROP ENUM public."MentionTypeEnum";
