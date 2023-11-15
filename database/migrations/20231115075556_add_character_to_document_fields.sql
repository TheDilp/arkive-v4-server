-- migrate:up
CREATE TABLE public.character_documents_fields (
    character_id text NOT NULL,
    character_field_id text NOT NULL,
    related_id text NOT NULL
);
ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);
ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;




-- migrate:down
DROP TABLE public.character_documents_fields;
