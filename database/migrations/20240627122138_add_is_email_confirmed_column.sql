-- migrate:up
ALTER TABLE users
ADD COLUMN is_email_confirmed BOOLEAN DEFAULT FALSE;

-- migrate:down
ALTER TABLE users
DROP COLUMN is_email_confirmed;