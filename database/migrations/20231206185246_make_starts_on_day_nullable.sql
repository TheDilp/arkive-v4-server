-- migrate:up
ALTER TABLE calendars ALTER COLUMN starts_on_day DROP NOT NULL;

-- migrate:down
ALTER TABLE calendars ALTER COLUMN starts_on_day ADD CONSTRAINT NOT NULL;

