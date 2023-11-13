-- migrate:up
ALTER TABLE words ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
CREATE INDEX words_ts_index ON words USING GIN (ts);

-- migrate:down
ALTER TABLE words DROP COLUMN ts;
ALTER TABLE words DROP INDEX words_ts_index;