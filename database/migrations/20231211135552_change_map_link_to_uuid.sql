-- migrate:up
ALTER TABLE map_pins ALTER COLUMN map_link TYPE UUID USING map_link::UUID;


-- migrate:down

