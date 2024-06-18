-- migrate:up
CREATE TABLE
    games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        title TEXT NOT NULL,
        owner_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
        background_image UUID REFERENCES images (id) ON DELETE SET NULL,
        next_session_date TIMESTAMP(3)
        with
            time zone,
            description JSONB
    );

CREATE TABLE
    game_players (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        game_id UUID NOT NULL REFERENCES games (id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'gamemaster'))
    );

CREATE TABLE
    game_characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        related_id UUID NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
        game_id UUID NOT NULL REFERENCES games (id) ON DELETE CASCADE
    );

CREATE TABLE
    game_character_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
        game_id UUID NOT NULL REFERENCES games (id) ON DELETE CASCADE
    );

-- migrate:down
DROP TABLE game_character_permissions;

DROP TABLE game_characters;

DROP TABLE game_players;

DROP TABLE games;