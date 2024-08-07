-- migrate:up
ALTER TABLE IF EXISTS document_template_fields
ADD COLUMN blueprint_id UUID REFERENCES blueprints (id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS document_template_fields
ADD COLUMN calendar_id UUID REFERENCES calendars (id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS document_template_fields
ADD COLUMN map_id UUID REFERENCES maps (id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS document_template_fields
ADD COLUMN dictionary_id UUID REFERENCES dictionaries (id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE IF EXISTS document_template_fields
DROP COLUMN blueprint_id;

ALTER TABLE IF EXISTS document_template_fields
DROP COLUMN calendar_id;

ALTER TABLE IF EXISTS document_template_fields
DROP COLUMN map_id;

ALTER TABLE IF EXISTS document_template_fields
DROP COLUMN dictionary_id;