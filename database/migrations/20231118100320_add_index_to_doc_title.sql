-- migrate:up
CREATE INDEX idx_documents_title_ilike ON documents USING gin (title gin_trgm_ops);

-- migrate:down
DROP INDEX idx_documents_title_ilike;
