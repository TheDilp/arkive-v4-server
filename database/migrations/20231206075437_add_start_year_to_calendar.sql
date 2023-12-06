-- migrate:up
ALTER TABLE calendars ADD COLUMN starts_on_day INT NOT NULL DEFAULT 1;

-- migrate:down
ALTER TABLE calendars DROP COLUMN starts_on_day;
