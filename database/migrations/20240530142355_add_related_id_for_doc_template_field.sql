-- migrate:up
ALTER TABLE
    document_template_fields
ADD
    COLUMN related_id UUID;

-- migrate:down
ALTER TABLE
    document_template_fields DROP COLUMN related_id;