-- migrate:up
ALTER TABLE
    characters
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    blueprints
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    blueprint_instances
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    documents
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    maps
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    map_pins
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    graphs
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    calendars
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    events
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    dictionaries
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    words
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    random_tables
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    tags
ADD
    COLUMN deleted_at timestamp(3) without time zone;

ALTER TABLE
    character_fields_templates
ADD
    COLUMN deleted_at timestamp(3) without time zone;

-- migrate:down
ALTER TABLE
    characters DROP COLUMN deleted_at;

ALTER TABLE
    blueprints DROP COLUMN deleted_at;

ALTER TABLE
    blueprint_instances DROP COLUMN deleted_at;

ALTER TABLE
    maps DROP COLUMN deleted_at;

ALTER TABLE
    map_pins DROP COLUMN deleted_at;

ALTER TABLE
    graphs DROP COLUMN deleted_at;

ALTER TABLE
    calendars DROP COLUMN deleted_at;

ALTER TABLE
    events DROP COLUMN deleted_at;

ALTER TABLE
    dictionaries DROP COLUMN deleted_at;

ALTER TABLE
    words DROP COLUMN deleted_at;

ALTER TABLE
    random_tables DROP COLUMN deleted_at;

ALTER TABLE
    tags DROP COLUMN deleted_at;

ALTER TABLE
    character_fields_templates DROP COLUMN deleted_at;