-- migrate:up
CREATE TABLE
    IF NOT EXISTS game_journal_entries (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        title text NOT NULL,
        game_id uuid NOT NULL REFERENCES games (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_blueprint_instances (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES blueprint_instances (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_characters (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_documents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_graphs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES graphs (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_images (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES images (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_map_pins (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES map_pins (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

CREATE TABLE
    IF NOT EXISTS game_journal_entry_maps (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
        related_id uuid NOT NULL REFERENCES maps (id) ON DELETE CASCADE,
        parent_id uuid NOT NULL REFERENCES game_journal_entries (id) ON DELETE CASCADE,
        sort integer
    );

-- migrate:down
DROP TABLE IF EXISTS game_journal_entry_blueprint_instances;

DROP TABLE IF EXISTS game_journal_entry_characters;

DROP TABLE IF EXISTS game_journal_entry_documents;

DROP TABLE IF EXISTS game_journal_entry_events;

DROP TABLE IF EXISTS game_journal_entry_graphs;

DROP TABLE IF EXISTS game_journal_entry_images;

DROP TABLE IF EXISTS game_journal_entry_map_pins;

DROP TABLE IF EXISTS game_journal_entry_maps;

DROP TABLE IF EXISTS game_journal_entries;