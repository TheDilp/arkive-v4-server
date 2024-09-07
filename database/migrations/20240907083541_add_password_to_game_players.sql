-- migrate:up
ALTER TABLE IF EXISTS game_players
ADD COLUMN password TEXT NOT NULL;

-- migrate:down
ALTER TABLE IF EXISTS game_players
DROP COLUMN password;