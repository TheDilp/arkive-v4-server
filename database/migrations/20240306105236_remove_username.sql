-- migrate:up
ALTER TABLE
    users DROP COLUMN username;

-- migrate:down
ALTER TABLE
    USERS
ADD
    COLUMN username text NOT NULL;