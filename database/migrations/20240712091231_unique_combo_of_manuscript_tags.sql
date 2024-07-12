-- migrate:up
ALTER TABLE manuscript_tags ADD CONSTRAINT unique_manuscript_tags UNIQUE (related_id, tag_id);

-- migrate:down
ALTER TABLE manuscript_tags
DROP CONSTRAINT unique_manuscript_tags;