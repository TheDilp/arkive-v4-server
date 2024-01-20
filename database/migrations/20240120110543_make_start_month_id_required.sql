-- migrate:up
ALTER TABLE
    public."events"
ALTER COLUMN
    start_month_id
SET
    NOT NULL;

-- migrate:down
ALTER TABLE
    public."events"
ALTER COLUMN
    start_month_id DROP NOT NULL;