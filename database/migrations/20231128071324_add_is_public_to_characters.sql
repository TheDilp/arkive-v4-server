-- migrate:up
ALTER TABLE characters ADD COLUMN is_public BOOLEAN;

-- migrate:down
ALTER TABLE characters DROP COLUMN is_public;

