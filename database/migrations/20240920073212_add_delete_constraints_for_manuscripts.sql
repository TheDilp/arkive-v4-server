-- migrate:up
DROP TABLE IF EXISTS manuscript_tags;

DROP TABLE IF EXISTS manuscript_characters;

DROP TABLE IF EXISTS manuscript_blueprint_instances;

DROP TABLE IF EXISTS manuscript_documents;

DROP TABLE IF EXISTS manuscript_maps;

DROP TABLE IF EXISTS manuscript_map_pins;

DROP TABLE IF EXISTS manuscript_graphs;

DROP TABLE IF EXISTS manuscript_images;

DROP TABLE IF EXISTS manuscript_events;

DROP TABLE IF EXISTS manuscripts;

-- migrate:down
CREATE TABLE
    manuscripts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title TEXT NOT NULL,
        project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
        is_public BOOLEAN,
        icon TEXT
    );

CREATE TABLE
    manuscript_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        tag_id UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
        related_id UUID NOT NULL REFERENCES manuscripts (id) ON DELETE CASCADE
    );

CREATE TABLE
    manuscript_documents (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.documents (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_characters (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.characters (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_blueprint_instances (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.blueprint_instances (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscripts (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.maps (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_pins (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.map_pins (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_graphs (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.graphs (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_events (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_images (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.images (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );