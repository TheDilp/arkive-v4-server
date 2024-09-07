-- migrate:up
ALTER TABLE IF EXISTS game_players
DROP COLUMN user_id;

-- migrate:down
ALTER TABLE IF EXISTS game_players
ADD COLUMN user_id UUID REFERENCES users (id) ON DELETE CASCADE;