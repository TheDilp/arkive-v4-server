-- migrate:up
ALTER TABLE game_character_permissions ADD CONSTRAINT unique_game_player_character_permission UNIQUE (game_id, related_id, player_id);

-- migrate:down
ALTER TABLE game_character_permissions
DROP CONSTRAINT;