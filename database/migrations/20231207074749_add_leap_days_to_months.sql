-- migrate:up
ALTER TABLE public.months ADD COLUMN leap_days INT DEFAULT 0;
-- migrate:down
ALTER TABLE ONLY public.months DROP COLUMN leap_days;

