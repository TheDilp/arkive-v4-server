-- migrate:up
CREATE TABLE public.leap_days (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_id uuid NOT NULL,
    month_id uuid NOT NULL,
    conditions jsonb DEFAULT NULL
);

ALTER TABLE ONLY public.leap_days
    ADD CONSTRAINT leap_days_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.leap_days
    ADD CONSTRAINT leap_days_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.leap_days
    ADD CONSTRAINT leap_days_month_id_fkey FOREIGN KEY (month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
DROP TABLE public.leap_days;