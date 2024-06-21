-- migrate:up
ALTER TABLE users
ADD COLUMN image_id TEXT;

-- migrate:down
ALTER TABLE users
DROP COLUMN image_id TEXT;