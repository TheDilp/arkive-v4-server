-- migrate:up
ALTER TABLE
    character_value_fields
ADD
    CONSTRAINT unique_char_value_fields_constraint UNIQUE (character_field_id, character_id);

ALTER TABLE
    blueprint_instance_value
ADD
    CONSTRAINT unique_bpi_value_fields_constraint UNIQUE (blueprint_field_id, blueprint_instance_id);

-- migrate:down
ALTER TABLE
    character_value_fields DROP CONSTRAINT unique_char_value_fields_constraint;

ALTER TABLE
    character_value_fields DROP CONSTRAINT unique_bpi_value_fields_constraint;