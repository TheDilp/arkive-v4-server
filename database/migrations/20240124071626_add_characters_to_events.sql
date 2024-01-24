-- migrate:up
CREATE TABLE public."event_characters" (
    "event_id" uuid NOT NULL,
    "character_id" uuid NOT NULL
);

CREATE UNIQUE INDEX "event_characters_unique" ON public."event_characters" USING btree ("event_id", "character_id");

ALTER TABLE
    ONLY public."event_characters"
ADD
    CONSTRAINT "event_characters_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    ONLY public."event_characters"
ADD
    CONSTRAINT "event_characters_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
DROP TABLE public."event_characters";