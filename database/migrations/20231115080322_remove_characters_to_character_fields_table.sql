-- migrate:up
DROP TABLE characters_to_character_fields;

-- migrate:down
CREATE TABLE public.characters_to_character_fields (
    character_id text NOT NULL,
    character_field_id text NOT NULL,
    value jsonb
);

ALTER TABLE ONLY public.characters_to_character_fields
    ADD CONSTRAINT characters_to_character_fields_pkey PRIMARY KEY (character_id, character_field_id);
ALTER TABLE ONLY public.characters_to_character_fields
    ADD CONSTRAINT characters_to_character_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.characters_to_character_fields
    ADD CONSTRAINT characters_to_character_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;
