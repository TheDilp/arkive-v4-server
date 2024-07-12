-- migrate:up
DROP TABLE IF EXISTS manuscript_trees;

CREATE TABLE
    manuscript_entities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        document_id UUID REFERENCES documents (id) ON DELETE CASCADE,
        character_id UUID REFERENCES characters (id) ON DELETE CASCADE,
        blueprint_instance_id UUID REFERENCES blueprint_instances (id) ON DELETE CASCADE,
        map_id UUID REFERENCES maps (id) ON DELETE CASCADE,
        map_pin_id UUID REFERENCES map_pins (id) ON DELETE CASCADE,
        graph_id UUID REFERENCES graphs (id) ON DELETE CASCADE,
        event_id UUID REFERENCES events (id) ON DELETE CASCADE,
        image_id UUID REFERENCES images (id) ON DELETE CASCADE,
        parent_id UUID REFERENCES manuscript_entities (id) ON DELETE CASCADE,
        manuscript_id UUID NOT NULL REFERENCES manuscripts (id) ON DELETE CASCADE,
        sort INT
    );

-- migrate:down
DROP TABLE manuscript_entities;