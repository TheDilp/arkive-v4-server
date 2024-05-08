-- migrate:up
ALTER TABLE characters
DROP COLUMN is_favorite;

CREATE TABLE
    favorite_characters (
        character_id UUID NOT NULL REFERENCES characters (id),
        user_id UUID NOT NULL REFERENCES users (id),
        is_favorite BOOL,
        UNIQUE (user_id, character_id)
    );

-- migrate:down
ALTER TABLE characters
ADD COLUMN is_favorite BOOL;

DROP TABLE favorite_characters;