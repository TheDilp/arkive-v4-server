-- migrate:up
ALTER TABLE document_mentions ADD CONSTRAINT unique_document_mentions UNIQUE (parent_document_id, mention_id);

-- migrate:down
ALTER TABLE document_mentions
DROP CONSTRAINT unique_document_mentions;