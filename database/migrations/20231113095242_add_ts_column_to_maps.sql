-- migrate:up
ALTER TABLE maps ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
CREATE INDEX maps_ts_index ON maps USING GIN (ts);

-- migrate:down
ALTER TABLE maps DROP COLUMN ts;
ALTER TABLE maps DROP INDEX maps_ts_index;