-- migrate:up
ALTER TABLE characters ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))) STORED;
CREATE INDEX character_ts_index ON characters USING GIN (ts);
-- migrate:down
ALTER TABLE characters DROP COLUMN ts;
ALTER TABLE characters DROP INDEX character_ts_index;
