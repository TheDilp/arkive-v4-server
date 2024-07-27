-- migrate:up
CREATE TABLE
    IF NOT EXISTS gateway_configurations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title TEXT NOT NULL,
        owner_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        gateway_type TEXT NOT NULL CHECK (gateway_type IN ('characters', 'blueprint_instances'))
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES characters (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_blueprint_instances (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES blueprint_instances (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES documents (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_maps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES maps (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_map_pins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES map_pins (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES images (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS gateway_configuration_random_tables (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES gateway_configurations (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES random_tables (id) ON DELETE CASCADE
    );

-- migrate:down
DROP TABLE IF EXISTS gateway_configuration_random_tables;

DROP TABLE IF EXISTS gateway_configuration_images;

DROP TABLE IF EXISTS gateway_configuration_events;

DROP TABLE IF EXISTS gateway_configuration_map_pins;

DROP TABLE IF EXISTS gateway_configuration_maps;

DROP TABLE IF EXISTS gateway_configuration_documents;

DROP TABLE IF EXISTS gateway_configuration_blueprint_instances;

DROP TABLE IF EXISTS gateway_configuration_characters;

DROP TABLE IF EXISTS gateway_configurations;