-- migrate:up
CREATE OR REPLACE FUNCTION updated_at_change() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ language 'plpgsql';
CREATE TRIGGER update_modified_time BEFORE UPDATE ON characters FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON blueprints FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON blueprint_instances FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON maps FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON graphs FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON random_tables FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON dictionaries FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON messages FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON calendars FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE updated_at_change();
CREATE TRIGGER update_modified_time BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE updated_at_change();

-- migrate:down
DROP TRIGGER IF EXISTS update_modified_time ON characters;
DROP TRIGGER IF EXISTS update_modified_time ON blueprints;
DROP TRIGGER IF EXISTS update_modified_time ON blueprint_instances;
DROP TRIGGER IF EXISTS update_modified_time ON documents;
DROP TRIGGER IF EXISTS update_modified_time ON maps;
DROP TRIGGER IF EXISTS update_modified_time ON graphs;
DROP TRIGGER IF EXISTS update_modified_time ON random_tables;
DROP TRIGGER IF EXISTS update_modified_time ON dictionaries;
DROP TRIGGER IF EXISTS update_modified_time ON conversations;
DROP TRIGGER IF EXISTS update_modified_time ON messages;
DROP TRIGGER IF EXISTS update_modified_time ON calendars;
DROP TRIGGER IF EXISTS update_modified_time ON events;
DROP TRIGGER IF EXISTS update_modified_time ON users;
DROP FUNCTION updated_at_change;