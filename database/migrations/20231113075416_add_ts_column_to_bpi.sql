-- migrate:up
ALTER TABLE blueprint_instances ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
CREATE INDEX bpi_ts_index ON blueprint_instances USING GIN (ts);

-- migrate:down
ALTER TABLE blueprint_instances DROP COLUMN ts;
ALTER TABLE blueprint_instances DROP INDEX bpi_ts_index;

