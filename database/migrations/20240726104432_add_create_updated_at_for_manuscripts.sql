-- migrate:up
ALTER TABLE manuscripts
ADD COLUMN created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;

ALTER TABLE manuscripts
ADD COLUMN updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;

-- migrate:down
ALTER TABLE manuscripts
DROP COLUMN created_at;

ALTER TABLE manuscripts
DROP COLUMN updated_at;