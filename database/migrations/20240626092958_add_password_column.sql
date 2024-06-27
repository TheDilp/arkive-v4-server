-- migrate:up
ALTER TABLE users ADD CONSTRAINT password_or_auth CHECK (
    (
        password IS NOT NULL
        OR oauth IS NOT NULL
    )
    AND (
        (
            password IS NULL
            AND oauth IS NOT NULL
        )
        OR (
            password IS NOT NULL
            AND oauth IS NULL
        )
    )
);

-- migrate:down
ALTER TABLE users
DROP constraint password_or_auth;