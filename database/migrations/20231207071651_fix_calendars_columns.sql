-- migrate:up
ALTER TABLE calendars ALTER COLUMN starts_on_day SET DEFAULT 0;
ALTER TABLE calendars DROP COLUMN "offset";

-- migrate:down
ALTER TABLE calendars ALTER COLUMN starts_on_day SET DEFAULT 0;
