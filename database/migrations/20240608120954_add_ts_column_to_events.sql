-- migrate:up
ALTER TABLE events ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, title)) STORED;

-- migrate:down
ALTER TABLE events DROP COLUMN ts;
