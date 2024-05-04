-- migrate:up
CREATE TABLE
    character_characters_fields (
        character_id uuid NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
        character_field_id uuid NOT NULL REFERENCES character_fields (id) ON DELETE CASCADE,
        related_id uuid NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
        UNIQUE (character_id, character_field_id, related_id)
    );

-- migrate:down
DROP TABLE character_characters_fields;