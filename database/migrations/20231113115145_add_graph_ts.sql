-- migrate:up
ALTER TABLE graphs ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
CREATE INDEX graphs_ts_index ON graphs USING GIN (ts);

-- migrate:down
ALTER TABLE graphs DROP COLUMN ts;
ALTER TABLE graphs DROP INDEX graphs_ts_index;