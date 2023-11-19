-- migrate:up
CREATE INDEX idx_characters_full_name_ilike ON characters USING gin (full_name gin_trgm_ops);

-- migrate:down
DROP INDEX idx_characters_full_name_ilike;
