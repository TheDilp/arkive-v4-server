-- migrate:up
ALTER TABLE
    users RENAME COLUMN nickname TO username;

ALTER TABLE
    users
ADD
    CONSTRAINT unique_user_email UNIQUE (email);

ALTER TABLE
    users
ADD
    CONSTRAINT unique_user_username UNIQUE (username);

ALTER TABLE
    users
ALTER COLUMN
    username DROP NOT NULL;

-- migrate:down
ALTER TABLE
    users RENAME COLUMN username TO nickname;

ALTER TABLE
    users DROP CONSTRAINT unique_user_email;

ALTER TABLE
    users DROP CONSTRAINT unique_user_username;

ALTER TABLE
    users
ALTER COLUMN
    username
SET
    NOT NULL;