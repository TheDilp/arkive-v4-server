-- migrate:up
CREATE TABLE public."event_groups" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL
);

ALTER TABLE
    public."events"
ADD
    COLUMN event_group_id uuid;

ALTER TABLE
    ONLY public.event_groups
ADD
    CONSTRAINT event_groups_pkey PRIMARY KEY (id);

ALTER TABLE
    ONLY public."events"
ADD
    CONSTRAINT "events_event_group_id_fkey" FOREIGN KEY ("event_group_id") REFERENCES public.event_groups(id) ON UPDATE CASCADE;

-- migrate:down
ALTER TABLE
    public."events" DROP COLUMN event_group_id;

DROP TABLE public."event_groups";