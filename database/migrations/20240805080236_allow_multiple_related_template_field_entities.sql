-- migrate:up
ALTER TABLE document_template_fields
DROP COLUMN related_id;

CREATE TABLE
    document_template_fields_characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_blueprint_instances (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES blueprint_instances (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_maps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES maps (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_map_pins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES map_pins (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_graphs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES graphs (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_words (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES words (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

CREATE TABLE
    document_template_fields_random_tables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES random_tables (id) ON DELETE CASCADE,
        field_id UUID NOT NULL REFERENCES document_template_fields (id) ON DELETE CASCADE
    );

-- migrate:down
ALTER TABLE document_template_fields
ADD COLUMN related_id UUID;

DROP TABLE document_template_fields_characters;

DROP TABLE document_template_fields_blueprint_instances;

DROP TABLE document_template_fields_documents;

DROP TABLE document_template_fields_maps;

DROP TABLE document_template_fields_map_pins;

DROP TABLE document_template_fields_graphs;

DROP TABLE document_template_fields_events;

DROP TABLE document_template_fields_words;

DROP TABLE document_template_fields_random_tables;