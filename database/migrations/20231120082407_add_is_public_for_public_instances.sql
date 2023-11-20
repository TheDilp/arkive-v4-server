-- migrate:up
ALTER TABLE blueprint_instances ADD COLUMN is_public BOOLEAN NULL;


-- migrate:down
ALTER TABLE bluepprint_instances DROP COLUMN is_public;
