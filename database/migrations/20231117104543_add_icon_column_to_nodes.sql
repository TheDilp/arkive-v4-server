-- migrate:up
ALTER TABLE nodes ADD COLUMN icon TEXT NULL;

-- migrate:down
ALTER TABLE nodes DROP COLUMN icon;

