-- migrate:up
CREATE OR REPLACE FUNCTION trim_character_text() RETURNS TRIGGER AS $$
BEGIN
    NEW.first_name = TRIM(NEW.first_name);
    NEW.last_name = TRIM(NEW.last_name);
    NEW.nickname = TRIM(NEW.nickname);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trim_title_text() RETURNS TRIGGER AS $$
BEGIN
    NEW.title = TRIM(NEW.title);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trim_characters_title
BEFORE INSERT OR UPDATE ON characters
FOR EACH ROW
EXECUTE FUNCTION trim_character_text();

CREATE TRIGGER trim_blueprints_title
BEFORE INSERT OR UPDATE ON blueprints
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_blueprint_instances_title
BEFORE INSERT OR UPDATE ON blueprint_instances
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_documents_title
BEFORE INSERT OR UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_maps_title
BEFORE INSERT OR UPDATE ON maps
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_graphs_title
BEFORE INSERT OR UPDATE ON graphs
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_calendars_title
BEFORE INSERT OR UPDATE ON calendars
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_events_title
BEFORE INSERT OR UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_months_title
BEFORE INSERT OR UPDATE ON months
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_dictionaries_title
BEFORE INSERT OR UPDATE ON dictionaries
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_words_title
BEFORE INSERT OR UPDATE ON words
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_random_tables_title
BEFORE INSERT OR UPDATE ON random_tables
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_tags_title
BEFORE INSERT OR UPDATE ON tags
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_images_title
BEFORE INSERT OR UPDATE ON images
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();

CREATE TRIGGER trim_character_fields_templates_title
BEFORE INSERT OR UPDATE ON character_fields_templates
FOR EACH ROW
EXECUTE FUNCTION trim_title_text();
-- migrate:down

DROP TRIGGER trim_characters_title ON  characters;
DROP TRIGGER trim_blueprints_title ON  blueprints;
DROP TRIGGER trim_blueprint_instances_title ON  blueprint_instances;
DROP TRIGGER trim_documents_title ON  documents;
DROP TRIGGER trim_maps_title ON  maps;
DROP TRIGGER trim_graphs_title ON  graphs;
DROP TRIGGER trim_calendars_title ON  calendars;
DROP TRIGGER trim_months_title ON  months;
DROP TRIGGER trim_events_title ON  events;
DROP TRIGGER trim_dictionaries_title ON  dictionaries;
DROP TRIGGER trim_words_title ON  words;
DROP TRIGGER trim_random_tables_title ON  random_tables;
DROP TRIGGER trim_tags_title ON  tags;
DROP TRIGGER trim_images_title ON  images;
DROP TRIGGER trim_character_fields_templates_title ON  character_fields_templates;







