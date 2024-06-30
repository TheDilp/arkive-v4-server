-- migrate:up
ALTER TABLE words
ADD COLUMN is_public BOOLEAN;

-- migrate:down
ALTER TABLE words
DROP COLUMN is_public;