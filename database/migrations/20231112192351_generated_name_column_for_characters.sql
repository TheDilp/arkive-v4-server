-- migrate:up
ALTER TABLE characters ADD COLUMN full_name TEXT GENERATED ALWAYS AS (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) STORED;

-- migrate:down
ALTER TABLE characters DROP COLUMN full_name;
