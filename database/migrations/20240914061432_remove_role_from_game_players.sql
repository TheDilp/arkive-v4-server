-- migrate:up
ALTER TABLE IF EXISTS game_players
DROP COLUMN role;

-- migrate:down
ALTER TABLE IF EXISTS game_players
ADD COLUMN role TEXT NOT NULL;