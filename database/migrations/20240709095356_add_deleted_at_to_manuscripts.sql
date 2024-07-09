-- migrate:up
ALTER TABLE manuscripts
ADD COLUMN deleted_at timestamp(3) without time zone;

-- migrate:down
ALTER TABLE manuscripts
DROP COLUMN deleted_at;