-- migrate:up
ALTER TABLE
    ONLY public."events" DROP COLUMN hours;

ALTER TABLE
    ONLY public."events" DROP COLUMN minutes;

ALTER TABLE
    ONLY public."events"
ADD
    COLUMN start_hours int;

ALTER TABLE
    ONLY public."events"
ADD
    COLUMN start_minutes int;

ALTER TABLE
    ONLY public."events"
ADD
    COLUMN end_hours int;

ALTER TABLE
    ONLY public."events"
ADD
    COLUMN end_minutes int;

-- migrate:down
ALTER TABLE
    ONLY public."events" DROP COLUMN start_hours;

ALTER TABLE
    ONLY public."events" DROP COLUMN start_minutes;

ALTER TABLE
    ONLY public."events" DROP COLUMN end_hours;

ALTER TABLE
    ONLY public."events" DROP COLUMN end_minutes;

ALTER TABLE
    ONLY public."events"
ADD
    COLUMN hours int;

ALTER TABLE
    ONLY public."events"
ADD
    COLUMN minutes int;