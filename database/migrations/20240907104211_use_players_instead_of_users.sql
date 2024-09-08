-- migrate:up
ALTER TABLE IF EXISTS game_character_permissions
DROP COLUMN user_id;

ALTER TABLE IF EXISTS game_character_permissions
ADD COLUMN player_id UUID NOT NULL REFERENCES game_players (id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS game_character_permissions
ADD COLUMN permission TEXT NOT NULL DEFAULT 'none' CHECK (permission IN ('none', 'view', 'read', 'own'))
-- migrate:down
ALTER TABLE IF EXISTS game_character_permissions
ADD COLUMN user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS game_character_permissions
DROP COLUMN player_id;

ALTER TABLE IF EXISTS game_character_permissions
DROP COLUMN permission;