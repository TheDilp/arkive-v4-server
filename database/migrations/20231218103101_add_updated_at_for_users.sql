-- migrate:up
ALTER TABLE
    ONLY public.users
ADD
    COLUMN updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;

-- migrate:down
ALTER TABLE
    ONLY public.users DROP COLUMN updated_at;