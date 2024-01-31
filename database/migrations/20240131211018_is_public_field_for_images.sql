-- migrate:up
ALTER TABLE
    public.images
ADD
    COLUMN is_public bool;

-- migrate:down
ALTER TABLE
    public.images DROP COLUMN is_public;