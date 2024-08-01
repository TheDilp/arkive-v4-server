-- migrate:up
ALTER TABLE users
RENAME COLUMN image_id TO image;

-- migrate:down
ALTER TABLE users
RENAME COLUMN image TO image_id;