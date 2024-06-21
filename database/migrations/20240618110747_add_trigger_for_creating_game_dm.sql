-- migrate:up
CREATE OR REPLACE FUNCTION add_game_player()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO game_players (user_id, game_id, role)
    VALUES (NEW.owner_id, NEW.id, 'gamemaster');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_game_insert
AFTER INSERT ON games
FOR EACH ROW
EXECUTE FUNCTION add_game_player();

-- migrate:down

DROP TRIGGER after_game_insert ON games;
DROP FUNCTION add_game_player();