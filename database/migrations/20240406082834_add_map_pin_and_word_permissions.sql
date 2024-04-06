-- migrate:up
INSERT INTO
    public."permissions" (title, code)
VALUES
    ('Create map pins', 'create_map_pins'),
    ('View map pins', 'read_map_pins'),
    ('Edit map pins', 'update_map_pins'),
    ('Delete map pins', 'delete_map_pins'),
    ('Create words', 'create_words'),
    ('View words', 'read_words'),
    ('Edit words', 'update_words'),
    ('Delete words', 'delete_words')
     ON CONFLICT DO NOTHING;

-- Map pins
ALTER TABLE map_pins ADD COLUMN owner_id UUID;

UPDATE
    map_pins
SET
    owner_id = maps.owner_id
FROM
    maps
WHERE
    maps.id = map_pins.parent_id;

ALTER TABLE
    map_pins
ALTER COLUMN
    owner_id
SET
    NOT NULL;


CREATE TABLE map_pin_permissions (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    related_id UUID NOT NULL,
    permission_id UUID,
    role_id UUID,
    user_id UUID,
    CONSTRAINT map_pin_permissions_fkey_constraint FOREIGN KEY (related_id) REFERENCES map_pins (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT map_pin_permissions_user_fkey_constraint FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT map_pin_permissions_role_fkey_constraint FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT unique_map_pin_role_combination UNIQUE (related_id, role_id),
    CONSTRAINT unique_map_pin_user_permission_combination UNIQUE (related_id, user_id, permission_id),
    CONSTRAINT check_role_user_presence CHECK (
        (
            role_id IS NOT NULL
            AND user_id IS NULL
            AND permission_id IS NULL
        )
        OR (
            role_id IS NULL
            AND user_id IS NOT NULL
            AND permission_id IS NOT NULL
        )
    )
);

-- Words

ALTER TABLE words ADD COLUMN owner_id UUID;

UPDATE
    words
SET
    owner_id = dictionaries.owner_id
FROM
    dictionaries
WHERE
    dictionaries.id = words.parent_id;

ALTER TABLE
    words
ALTER COLUMN
    owner_id
SET
    NOT NULL;


CREATE TABLE word_permissions (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    related_id UUID NOT NULL,
    permission_id UUID,
    role_id UUID,
    user_id UUID,
    CONSTRAINT word_permissions_fkey_constraint FOREIGN KEY (related_id) REFERENCES words (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT word_permissions_user_fkey_constraint FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT word_permissions_role_fkey_constraint FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT unique_word_role_combination UNIQUE (related_id, role_id),
    CONSTRAINT unique_word_user_permission_combination UNIQUE (related_id, user_id, permission_id),
    CONSTRAINT check_role_user_presence CHECK (
        (
            role_id IS NOT NULL
            AND user_id IS NULL
            AND permission_id IS NULL
        )
        OR (
            role_id IS NULL
            AND user_id IS NOT NULL
            AND permission_id IS NOT NULL
        )
    )
);






-- migrate:down

-- Map pins
DROP TABLE map_pin_permissions;
ALTER TABLE map_pins DROP COLUMN owner_id;
DELETE FROM permissions WHERE code LIKE '%_map_pins';

-- Words
DROP TABLE word_permissions;
ALTER TABLE words DROP COLUMN owner_id;
DELETE FROM permissions WHERE code LIKE '%_words';