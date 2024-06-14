-- migrate:up
CREATE OR REPLACE FUNCTION handle_bp_field_type_change()
RETURNS TRIGGER AS $$
DECLARE compatible BOOLEAN := FALSE;
BEGIN

    IF (OLD.field_type = NEW.field_type) THEN compatible := TRUE;

    ELSIF (OLD.field_type = 'characters_single' AND NEW.field_type = 'characters_multiple') OR
        (OLD.field_type = 'characters_multiple' AND NEW.field_type = 'characters_single') OR
        (OLD.field_type = 'documents_single' AND NEW.field_type = 'documents_multiple') OR
        (OLD.field_type = 'documents_multiple' AND NEW.field_type = 'documents_single') OR
        (OLD.field_type = 'images_single' AND NEW.field_type = 'images_multiple') OR
        (OLD.field_type = 'images_multiple' AND NEW.field_type = 'images_single') OR
        (OLD.field_type = 'locations_single' AND NEW.field_type = 'locations_multiple') OR
        (OLD.field_type = 'locations_multiple' AND NEW.field_type = 'locations_single') OR
        (OLD.field_type = 'blueprints_single' AND NEW.field_type = 'blueprints_multiple') OR
        (OLD.field_type = 'blueprints_multiple' AND NEW.field_type = 'blueprints_single') OR
        (OLD.field_type = 'events_single' AND NEW.field_type = 'events_multiple') OR
        (OLD.field_type = 'events_multiple' AND NEW.field_type = 'events_single') OR
        (OLD.field_type = 'select' AND NEW.field_type = 'select_multiple') OR
        (OLD.field_type = 'select_multiple' AND NEW.field_type = 'select') OR

        THEN
            compatible := TRUE;
    END IF;


  IF NOT compatible THEN
    IF (OLD.field_type = 'characters_single' OR OLD.field_type = 'characters_multiple') THEN
        DELETE FROM blueprint_instance_characters WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'documents_single' OR OLD.field_type = 'documents_multiple') THEN
        DELETE FROM blueprint_instance_documents WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'images_single' OR OLD.field_type = 'images_multiple') THEN
        DELETE FROM blueprint_instance_images WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'locations_single' OR OLD.field_type = 'locations_multiple') THEN
        DELETE FROM blueprint_instance_locations WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'blueprints_single' OR OLD.field_type = 'blueprints_multiple') THEN
        DELETE FROM blueprint_instance_blueprint_instances WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'events_single' OR OLD.field_type = 'events_multiple') THEN
        DELETE FROM blueprint_instance_events WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'random_table') THEN
        DELETE FROM blueprint_instance_random_tables WHERE blueprint_field_id = NEW.id;
    ELSIF (OLD.field_type = 'text' OR OLD.field_type = 'select' OR OLD.field_type = 'select_multiple' OR OLD.field_type = 'dice_roll'
            OR OLD.field_type = 'number' OR OLD.field_type = 'textarea' OR OLD.field_type = 'boolean' ) THEN
            DELETE FROM blueprint_instance_value WHERE blueprint_field_id = NEW.id;
    END IF;
END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_char_field_type_change()
RETURNS TRIGGER AS $$
DECLARE compatible BOOLEAN := FALSE;
BEGIN

    IF (OLD.field_type = NEW.field_type) THEN compatible := TRUE;

    ELSIF (OLD.field_type = 'characters_single' AND NEW.field_type = 'characters_multiple') OR
        (OLD.field_type = 'characters_multiple' AND NEW.field_type = 'characters_single') OR
        (OLD.field_type = 'documents_single' AND NEW.field_type = 'documents_multiple') OR
        (OLD.field_type = 'documents_multiple' AND NEW.field_type = 'documents_single') OR
        (OLD.field_type = 'images_single' AND NEW.field_type = 'images_multiple') OR
        (OLD.field_type = 'images_multiple' AND NEW.field_type = 'images_single') OR
        (OLD.field_type = 'locations_single' AND NEW.field_type = 'locations_multiple') OR
        (OLD.field_type = 'locations_multiple' AND NEW.field_type = 'locations_single') OR
        (OLD.field_type = 'blueprints_single' AND NEW.field_type = 'blueprints_multiple') OR
        (OLD.field_type = 'blueprints_multiple' AND NEW.field_type = 'blueprints_single') OR
        (OLD.field_type = 'events_single' AND NEW.field_type = 'events_multiple') OR
        (OLD.field_type = 'events_multiple' AND NEW.field_type = 'events_single') OR
        (OLD.field_type = 'select' AND NEW.field_type = 'select_multiple') OR
        (OLD.field_type = 'select_multiple' AND NEW.field_type = 'select') OR

        THEN
            compatible := TRUE;
    END IF;


  IF NOT compatible THEN
    IF (OLD.field_type = 'characters_single' OR OLD.field_type = 'characters_multiple') THEN
        DELETE FROM character_characters_fields WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'documents_single' OR OLD.field_type = 'documents_multiple') THEN
        DELETE FROM character_blueprint_instance_fields WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'images_single' OR OLD.field_type = 'images_multiple') THEN
        DELETE FROM character_images_fields WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'locations_single' OR OLD.field_type = 'locations_multiple') THEN
        DELETE FROM character_locations_fieldss WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'blueprints_single' OR OLD.field_type = 'blueprints_multiple') THEN
        DELETE FROM blueprint_instance_blueprint_instances WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'events_single' OR OLD.field_type = 'events_multiple') THEN
        DELETE FROM character_events_fields WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'random_table') THEN
        DELETE FROM character_random_table_fields WHERE character_field_id = NEW.id;
    ELSIF (OLD.field_type = 'text' OR OLD.field_type = 'select' OR OLD.field_type = 'select_multiple' OR OLD.field_type = 'dice_roll'
            OR OLD.field_type = 'number' OR OLD.field_type = 'textarea' OR OLD.field_type = 'boolean' ) THEN
            DELETE FROM character_value_fields WHERE character_field_id = NEW.id;
    END IF;
END IF;


    IF OLD.field_type = 'select' AND NEW.field_type = 'select_multiple' THEN
        UPDATE character_value_fields
        SET value = jsonb_build_array(value)
        WHERE character_field_id = NEW.id;

    END IF;



    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER bp_field_type_change_trigger
AFTER UPDATE OF field_type ON blueprint_fields
FOR EACH ROW
EXECUTE FUNCTION handle_bp_field_type_change();

CREATE TRIGGER char_field_type_change_trigger
AFTER UPDATE OF field_type ON character_fields
FOR EACH ROW
EXECUTE FUNCTION handle_char_field_type_change();
-- migrate:down

DROP TRIGGER bp_field_type_change_trigger ON blueprint_fields;
DROP FUNCTION handle_bp_field_type_change();

DROP TRIGGER char_field_type_change_trigger ON character_fields;
DROP FUNCTION handle_char_field_type_change();