-- migrate:up
ALTER TABLE
    users DROP COLUMN image;

-- migrate:down
ALTER TABLE
    users
ADD
    COLUMN image TEXT;