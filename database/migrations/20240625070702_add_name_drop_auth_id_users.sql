-- migrate:up
ALTER TABLE users
ADD COLUMN nickname TEXT UNIQUE;

ALTER TABLE users
DROP COLUMN auth_id;

-- migrate:down
ALTER TABLE users
ADD COLUMN auth_id TEXT;

ALTER TABLE
drop
ADD COLUMN nickname;