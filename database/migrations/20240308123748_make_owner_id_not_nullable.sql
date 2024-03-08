-- migrate:up
ALTER TABLE
    characters
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    blueprints
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    blueprint_instances
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    documents
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    maps
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    graphs
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    calendars
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    dictionaries
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    tags
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    images
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    random_tables
ALTER COLUMN
    owner_id
SET
    NOT NULL;

ALTER TABLE
    character_fields_templates
ALTER COLUMN
    owner_id
SET
    NOT NULL;

-- migrate:down
ALTER TABLE
    characters
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    blueprints
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    blueprint_instances
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    documents
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    maps
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    graphs
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    calendars
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    dictionaries
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    tags
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    images
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    random_tables
ALTER COLUMN
    owner_id DROP NOT NULL;

ALTER TABLE
    character_fields_templates
ALTER COLUMN
    owner_id DROP NOT NULL;