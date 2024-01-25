-- migrate:up
ALTER TABLE
    public."event_characters" RENAME COLUMN character_id TO related_id;

ALTER TABLE
    public."event_map_pins" RENAME COLUMN map_pin_id TO related_id;

-- migrate:down
ALTER TABLE
    public."event_characters" RENAME COLUMN related_id TO character_id;

ALTER TABLE
    public."event_map_pins" RENAME COLUMN related_id TO map_pin_id;