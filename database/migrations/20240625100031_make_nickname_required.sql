-- migrate:up
ALTER TABLE users
ALTER COLUMN nickname
SET
    NOT NULL;

-- migrate:down
ALTER TABLE users
ALTER COLUMN nickname
DROP NOT NULL;