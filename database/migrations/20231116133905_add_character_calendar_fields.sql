-- migrate:up
CREATE TABLE public.character_calendar_fields (
    character_id text NOT NULL,
    character_field_id text NOT NULL,
    related_id text NOT NULL,
    end_month_id text,
    start_month_id text,
    end_day integer,
    end_year integer,
    start_day integer,
    start_year integer
);

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);
CREATE UNIQUE INDEX character_calendar_fields_character_id_key ON public.character_calendar_fields USING btree (character_id, character_field_id, related_id);
ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_end_month_id_fkey FOREIGN KEY (end_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_start_month_id_fkey FOREIGN KEY (start_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- migrate:down
DROP TABLE public.character_calendar_fields;
