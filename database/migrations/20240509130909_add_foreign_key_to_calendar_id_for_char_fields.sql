-- migrate:up
ALTER TABLE ONLY public.character_fields ADD CONSTRAINT character_fields_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.character_fields ADD CONSTRAINT character_fields_random_table_id_fkey FOREIGN KEY (random_table_id) REFERENCES public.random_tables (id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE ONLY public.character_fields
DROP CONSTRAINT character_fields_calendar_id_fkey;

ALTER TABLE ONLY public.character_fields
DROP CONSTRAINT character_fields_random_table_id_fkey;