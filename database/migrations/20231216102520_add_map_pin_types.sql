-- migrate:up
CREATE TABLE public.map_pin_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    title TEXT NOT NULL
);

ALTER TABLE
    ONLY public.map_pins
ADD
    COLUMN map_pin_type_id uuid DEFAULT NULL;

ALTER TABLE
    ONLY public.map_pin_types
ADD
    CONSTRAINT map_pin_types_pkey PRIMARY KEY (id);

ALTER TABLE
    ONLY public.map_pin_types
ADD
    CONSTRAINT map_pin_types_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    ONLY public.map_pins
ADD
    CONSTRAINT map_pin_types_id_fkey FOREIGN KEY (map_pin_type_id) REFERENCES public.map_pin_types(id) ON UPDATE CASCADE;

-- migrate:down
ALTER TABLE
    public.map_pins DROP COLUMN map_pin_type_id;

DROP TABLE map_pin_types;