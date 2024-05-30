-- migrate:up
CREATE EXTENSION IF NOT EXISTS tsm_system_rows;

-- migrate:down
DROP EXTENSION tsm_system_rows;