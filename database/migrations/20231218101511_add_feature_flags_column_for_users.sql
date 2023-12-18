-- migrate:up
ALTER TABLE
    ONLY users
ADD
    COLUMN feature_flags jsonb;

-- migrate:down
ALTER TABLE
    ONLY users DROP COLUMN feature_flags;