-- migrate:up
ALTER TABLE
    roles
ADD
    COLUMN icon TEXT;

-- migrate:down
ALTER TABLE
    roles DROP COLUMN icon;