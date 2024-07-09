-- migrate:up
ALTER TABLE manuscripts
ADD COLUMN owner_id UUID NOT NULL REFERENCES users (id);

-- migrate:down
ALTER TABLE manuscripts
DROP COLUMN owner_id;