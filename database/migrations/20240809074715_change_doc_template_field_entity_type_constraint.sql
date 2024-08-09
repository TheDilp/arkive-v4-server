-- migrate:up
ALTER TABLE document_template_fields
DROP CONSTRAINT document_template_fields_entity_type_check;

ALTER TABLE document_template_fields
ADD CONSTRAINT document_template_fields_entity_type_check
CHECK (entity_type = ANY (ARRAY['characters', 'blueprint_instances', 'documents', 'maps', 'map_pins', 'graphs', 'dictionaries', 'events', 'calendars', 'words', 'random_tables', 'dice_roll', 'derived', 'custom', 'images']));


-- migrate:down

ALTER TABLE document_template_fields
DROP CONSTRAINT document_template_fields_entity_type_check;

ALTER TABLE document_template_fields
ADD CONSTRAINT document_template_fields_entity_type_check
CHECK (entity_type = ANY (ARRAY['characters', 'blueprint_instances', 'documents', 'maps', 'map_pins', 'graphs', 'dictionaries', 'events', 'calendars', 'words', 'random_tables', 'dice_roll', 'derived', 'custom']));
