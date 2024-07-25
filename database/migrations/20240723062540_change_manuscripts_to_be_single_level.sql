-- migrate:up
ALTER TABLE manuscript_tags
DROP CONSTRAINT manuscript_tags_related_id_fkey;

ALTER TABLE manuscript_tags ADD CONSTRAINT manuscript_tags_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.manuscripts (id) ON DELETE CASCADE;

DROP TABLE manuscript_entities;

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
    manuscript_maps (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        related_id UUID NOT NULL REFERENCES public.maps (id) ON DELETE CASCADE,
        parent_id UUID NOT NULL REFERENCES public.manuscripts (id) ON DELETE CASCADE,
        sort INTEGER
    );

CREATE TABLE
    manuscript_map_pins (
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

-- migrate:down
DROP CONSTRAINT manuscript_tags_related_id_fkey;

ALTER TABLE manuscript_tags ADD CONSTRAINT manuscript_tags_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.manuscripts (id) ON DELETE CASCADE;

DROP TABLE manuscript_entities;

CREATE TABLE
    manuscript_entities (
        id uuid DEFAULT gen_random_uuid () NOT NULL,
        document_id uuid,
        character_id uuid,
        blueprint_instance_id uuid,
        map_id uuid,
        map_pin_id uuid,
        graph_id uuid,
        event_id uuid,
        image_id uuid,
        parent_id uuid,
        manuscript_id uuid NOT NULL,
        sort integer
    );

DROP TABLE manuscript_characters;

DROP TABLE manuscript_blueprint_instances;

DROP TABLE manuscript_documents;

DROP TABLE manuscript_maps;

DROP TABLE manuscript_map_pins;

DROP TABLE manuscript_map_graphs;

DROP TABLE manuscript_map_images;

DROP TABLE manuscript_map_events;