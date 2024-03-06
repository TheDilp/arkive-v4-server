-- migrate:up
INSERT INTO
    public."permissions" (title, code)
VALUES
    ('Create characters', 'create_characters'),
    ('View characters', 'read_characters'),
    ('Edit characters', 'update_characters'),
    ('Delete characters', 'delete_characters'),
    ('Create blueprints', 'create_blueprints'),
    ('View blueprints', 'read_blueprints'),
    ('Edit blueprints', 'update_blueprints'),
    ('Delete blueprints', 'delete_blueprints'),
    (
        'Create blueprint instances',
        'create_blueprint_instances'
    ),
    (
        'View blueprint instances',
        'read_blueprint_instances'
    ),
    (
        'Edit blueprint instances',
        'update_blueprint_instances'
    ),
    (
        'Delete blueprint instances',
        'delete_blueprint_instances'
    ),
    ('Create documents', 'create_documents'),
    ('View documents', 'read_documents'),
    ('Edit documents', 'update_documents'),
    ('Delete documents', 'delete_documents'),
    ('Create maps', 'create_maps'),
    ('View maps', 'read_maps'),
    ('Edit maps', 'update_maps'),
    ('Delete maps', 'delete_maps'),
    ('Create graphs', 'create_graphs'),
    ('View graphs', 'read_graphs'),
    ('Edit graphs', 'update_graphs'),
    ('Delete graphs', 'delete_graphs'),
    ('Create calendars', 'create_calendars'),
    ('View calendars', 'read_calendars'),
    ('Edit calendars', 'update_calendars'),
    ('Delete calendars', 'delete_calendars'),
    ('Create dictionaries', 'create_dictionaries'),
    ('View dictionaries', 'read_dictionaries'),
    ('Edit dictionaries', 'update_dictionaries'),
    ('Delete dictionaries', 'delete_dictionaries'),
    ('Create random tables', 'create_random_tables'),
    ('View random tables', 'read_random_tables'),
    ('Edit random tables', 'update_random_tables'),
    ('Delete random tables', 'delete_random_tables'),
    ('Create tags', 'create_tags'),
    ('View tags', 'read_tags'),
    ('Edit tags', 'update_tags'),
    ('Delete tags', 'delete_tags'),
    (
        'Create character templates',
        'create_character_fields_templates'
    ),
    (
        'View character templates',
        'read_character_fields_templates'
    ),
    (
        'Edit character templates',
        'update_character_fields_templates'
    ),
    (
        'Delete character templates',
        'delete_character_fields_templates'
    ),
    (
        'Upload assets',
        'create_assets'
    ),
    (
        'View assets',
        'read_assets'
    ),
    (
        'Edit assets',
        'update_assets'
    ),
    (
        'Delete assets',
        'delete_assets'
    ) ON CONFLICT DO NOTHING;

-- migrate:down
DELETE FROM
    public."permissions";