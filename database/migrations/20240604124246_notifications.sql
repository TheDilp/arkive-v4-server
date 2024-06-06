-- migrate:up
CREATE TABLE
    notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID,
        title TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        user_name TEXT NOT NULL,
        user_image TEXT,
        image_id TEXT,
        created_at timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        action TEXT NOT NULL CHECK (action IN ('create', 'update', 'arkive', 'delete')),
        project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
        entity_type TEXT NOT NULL CHECK (
            entity_type IN (
                'characters',
                'blueprints',
                'blueprint_instances',
                'documents',
                'maps',
                'map_pins',
                'graphs',
                'nodes',
                'edges',
                'calendars',
                'events',
                'dictionaries',
                'words',
                'tags',
                'character_fields_templates',
                'images',
                'assets',
                'random_tables',
                'random_table_options'
            )
        ),
        related_id UUID NOT NULL
    );

CREATE TABLE
    user_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        notification_id UUID REFERENCES notifications (id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT FALSE
    );


CREATE OR REPLACE FUNCTION notify_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a record into user_notifications
    INSERT INTO user_notifications (user_id, notification_id)
    VALUES (
        NEW.user_id,
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_notification_insert
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION notify_user();






-- migrate:down
DROP TRIGGER IF EXISTS after_notification_insert ON notifications;
DROP FUNCTION IF EXISTS notify_user();

DROP TABLE user_notifications;

DROP TABLE notifications;
