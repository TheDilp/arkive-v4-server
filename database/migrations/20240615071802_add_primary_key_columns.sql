-- migrate:up
ALTER TABLE blueprint_instance_blueprint_instances
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_calendars
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_characters
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_documents
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_events
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_images
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_map_pins
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_random_tables
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE blueprint_instance_value
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_blueprint_instance_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_calendar_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_characters_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_documents_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_events_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_random_table_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE character_value_fields
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE event_characters
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE event_map_pins
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE favorite_characters
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

ALTER TABLE image_tags
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid ();

-- migrate:down
RAISE NOTICE 'Value: %',
'test';