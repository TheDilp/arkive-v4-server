-- migrate:up
ALTER TABLE document_template_fields
ADD COLUMN sort INT NOT NULL DEFAULT 0;

-- migrate:down
ALTER TABLE document_template_fields
DROP COLUMN sort;