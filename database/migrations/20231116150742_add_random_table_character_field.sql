-- migrate:up
CREATE TABLE public.character_random_table_fields (
    character_id text NOT NULL,
    character_field_id text NOT NULL,
    related_id text NOT NULL,
    option_id text,
    suboption_id text
);

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);
CREATE UNIQUE INDEX character_random_table_fields_character_id_blue_key ON public.character_random_table_fields USING btree (character_id, character_field_id, related_id);
ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.random_table_options(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.random_tables(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_suboption_id_fkey FOREIGN KEY (suboption_id) REFERENCES public.random_table_suboptions(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- migrate:down
DROP TABLE character_random_table_fields;
