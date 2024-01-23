-- migrate:up
ALTER TABLE
    public."map_pins"
ADD
    COLUMN ts tsvector GENERATED ALWAYS AS (to_tsvector('english' :: regconfig, title)) STORED;

-- migrate:down
ALTER TABLE
    public."map_pins" DROP COLUMN ts;