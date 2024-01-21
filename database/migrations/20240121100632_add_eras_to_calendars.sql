-- migrate:up
CREATE TABLE public.eras (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    parent_id uuid NOT NULL,
    end_day integer NOT NULL,
    end_month integer NOT NULL,
    end_year integer NOT NULL,
    start_day integer NOT NULL,
    start_month integer NOT NULL,
    start_year integer NOT NULL,
    start_month_id uuid NOT NULL,
    end_month_id uuid NOT NULL,
    color text NOT NULL
);

ALTER TABLE
    ONLY public.eras
ADD
    CONSTRAINT eras_pkey PRIMARY KEY (id);

ALTER TABLE
    ONLY public.eras
ADD
    CONSTRAINT eras_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
DROP TABLE public.eras;