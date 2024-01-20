-- migrate:up
ALTER TABLE
    public."events"
ADD
    COLUMN start_month_id UUID;

ALTER TABLE
    public."events"
ADD
    COLUMN end_month_id UUID;

ALTER TABLE
    ONLY public.events
ADD
    CONSTRAINT start_month_id_fkey FOREIGN KEY (start_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    ONLY public.events
ADD
    CONSTRAINT end_month_id_fkey FOREIGN KEY (end_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
ALTER TABLE
    public."events" DROP COLUMN start_month_id;

ALTER TABLE
    public."events" DROP COLUMN end_month_id;