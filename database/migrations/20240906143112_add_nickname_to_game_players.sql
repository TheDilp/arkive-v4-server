-- migrate:up
ALTER TABLE IF EXISTS game_players
ADD COLUMN nickname TEXT NOT NULL,
ADD CONSTRAINT unique_game_id_nickname UNIQUE (game_id, nickname);

-- migrate:down
ALTER TABLE IF EXISTS game_players
DROP COLUMN nickname;