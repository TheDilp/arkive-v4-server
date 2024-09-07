-- migrate:up
DROP TRIGGER IF EXISTS after_game_insert ON games;
DROP FUNCTION IF EXISTS add_game_player ();

-- migrate:down
CREATE OR REPLACE FUNCTION  public.add_game_player() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO game_players (user_id, game_id, role)
    VALUES (NEW.owner_id, NEW.id, 'gamemaster');
    RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER  after_game_insert AFTER INSERT ON public.games FOR EACH ROW EXECUTE FUNCTION public.add_game_player();
