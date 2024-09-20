-- migrate:up
ALTER TABLE IF EXISTS game_characters
ADD COLUMN parent_id UUID REFERENCES game_characters (id) ON DELETE CASCADE;

-- migrate:down
ALTER TABLE IF EXISTS game_characters
DROP COLUMN parent_id;