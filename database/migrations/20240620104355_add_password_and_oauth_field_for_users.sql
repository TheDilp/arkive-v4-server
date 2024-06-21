-- migrate:up
ALTER TABLE users
ADD COLUMN oauth TEXT;

ALTER TABLE users
ADD COLUMN password TEXT;

-- ALTER TABLE users ADD CONSTRAINT oauth_or_password_not_null CHECK (
--     oauth IS NOT NULL
--     OR password IS NOT NULL
-- );
ALTER TABLE users ADD CONSTRAINT oauth_type CHECK (oauth IN ('discord', 'google', 'github', 'facebook', 'twitter', 'notion', 'apple'));

-- migrate:down
-- ALTER TABLE users
-- DROP CONSTRAINT oauth_or_password_not_null;
ALTER TABLE users
DROP COLUMN oauth;

ALTER TABLE users
DROP COLUMN password;