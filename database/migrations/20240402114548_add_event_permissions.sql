-- migrate:up
INSERT INTO
    public."permissions" (title, code)
VALUES
    ('Create events', 'create_events'),
    ('View events', 'read_events'),
    ('Edit events', 'update_events'),
    ('Delete events', 'delete_events')
     ON CONFLICT DO NOTHING;

ALTER TABLE events ADD COLUMN owner_id UUID;

UPDATE
    events
SET
    owner_id = calendars.owner_id
FROM
    calendars
WHERE
    calendars.id = events.parent_id;

ALTER TABLE
    events
ALTER COLUMN
    owner_id
SET
    NOT NULL;


CREATE TABLE event_permissions (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    related_id UUID NOT NULL,
    permission_id UUID,
    role_id UUID,
    user_id UUID,
    CONSTRAINT event_permissions_fkey_constraint FOREIGN KEY (related_id) REFERENCES events (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT event_permissions_user_fkey_constraint FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT event_permissions_role_fkey_constraint FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT unique_event_role_combination UNIQUE (related_id, role_id),
    CONSTRAINT unique_event_user_permission_combination UNIQUE (related_id, user_id, permission_id),
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
DROP TABLE event_permissions;
ALTER TABLE events DROP COLUMN owner_id;
DELETE FROM permissions WHERE code LIKE '%_events';