-- migrate:up
ALTER TABLE permissions ADD COLUMN parent_category INT4;

UPDATE permissions
SET parent_category =
    CASE 
        WHEN code IN (
            'create_characters', 'read_characters', 'update_characters', 'delete_characters',
            'create_character_fields_templates', 'read_character_fields_templates',
            'update_character_fields_templates', 'delete_character_fields_templates'
        ) THEN 0
        WHEN code IN (
            'create_blueprints', 'read_blueprints', 'update_blueprints', 'delete_blueprints',
            'create_blueprint_instances', 'read_blueprint_instances',
            'update_blueprint_instances', 'delete_blueprint_instances'
        ) THEN 1
        WHEN code IN (
            'create_documents', 'read_documents', 'update_documents', 'delete_documents'
        ) THEN 2
        WHEN code IN (
            'create_maps', 'read_maps', 'update_maps', 'delete_maps',
            'create_map_pins', 'read_map_pins', 'update_map_pins', 'delete_map_pins'
        ) THEN 3
         WHEN code IN (
            'create_graphs', 'read_graphs', 'update_graphs', 'delete_graphs'
        ) THEN 4
        WHEN code IN (
            'create_calendars', 'read_calendars', 'update_calendars', 'delete_calendars',
            'create_events', 'read_events', 'update_events', 'delete_events'
        ) THEN 5
        WHEN code IN (
            'create_dictionaries', 'read_dictionaries', 'update_dictionaries', 'delete_dictionaries',
            'create_words', 'read_words', 'update_words', 'delete_words'
        ) THEN 6
         WHEN code IN (
            'create_random_tables', 'read_random_tables', 'update_random_tables', 'delete_random_tables'
        ) THEN 7
         WHEN code IN (
            'create_tags', 'read_tags', 'update_tags', 'delete_tags'
        ) THEN 8
         WHEN code IN (
            'create_assets', 'read_assets', 'update_assets', 'delete_assets'
        ) THEN 9
        ELSE NULL
    END;



-- migrate:down
ALTER TABLE permissions DROP COLUMN parent_category;

