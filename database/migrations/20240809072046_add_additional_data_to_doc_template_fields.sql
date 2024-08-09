-- migrate:up
ALTER TABLE IF EXISTS document_template_fields
ADD COLUMN additional_data JSONB;

-- migrate:down
ALTER TABLE IF EXISTS document_template_fields
DROP COLUMN additional_data;