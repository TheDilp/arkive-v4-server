-- migrate:up
CREATE TABLE
    IF NOT EXISTS character_fields_sections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title TEXT NOT NULL,
        owner_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        sort INT NOT NULL DEFAULT 0,
        parent_id UUID NOT NULL REFERENCES character_fields_templates (id) ON DELETE CASCADE
    );

ALTER TABLE character_fields
ADD COLUMN section_id UUID REFERENCES character_fields_sections (id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE character_fields DOPR COLUMN section_id;

DROP TABLE character_fields_sections;