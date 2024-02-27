-- migrate:up
ALTER TABLE
    users DROP COLUMN image;

ALTER TABLE
    users RENAME COLUMN nickname TO username;

ALTER TABLE
    users
ADD
    CONSTRAINT unique_user_email UNIQUE(email);

ALTER TABLE
    users
ADD
    CONSTRAINT unique_user_username UNIQUE(username);

-- migrate:down
ALTER TABLE
    users
ADD
    COLUMN image TEXT;

ALTER TABLE
    users DROP CONSTRAINT unique_user_email;

ALTER TABLE
    users DROP CONSTRAINT unique_user_username;