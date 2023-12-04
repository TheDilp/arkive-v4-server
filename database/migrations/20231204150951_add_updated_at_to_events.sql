-- migrate:up
ALTER TABLE events ADD COLUMN updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;


-- migrate:down
ALTER TABLE events DROP COLUMN updated_at;
