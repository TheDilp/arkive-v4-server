-- migrate:up
ALTER TABLE documents ADD COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
CREATE INDEX ts_idx ON documents USING GIN (ts);
-- migrate:down
ALTER TABLE documents DROP COLUMN ts;
ALTER TABLE documents DROP INDEX ts_idx;
