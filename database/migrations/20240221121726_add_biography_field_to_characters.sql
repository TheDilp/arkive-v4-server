-- migrate:up
ALTER TABLE
    public.characters
ADD
    COLUMN biography jsonb;

-- migrate:down
ALTER TABLE
    public.characters DROP COLUMN biography;