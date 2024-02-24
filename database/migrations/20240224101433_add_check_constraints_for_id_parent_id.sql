-- migrate:up
ALTER TABLE
    documents
ADD
    CONSTRAINT id_cannot_equal_parent_id_docs CHECK (id <> parent_id);

ALTER TABLE
    maps
ADD
    CONSTRAINT id_cannot_equal_parent_id_maps CHECK (id <> parent_id);

ALTER TABLE
    graphs
ADD
    CONSTRAINT id_cannot_equal_parent_id_graphs CHECK (id <> parent_id);

ALTER TABLE
    calendars
ADD
    CONSTRAINT id_cannot_equal_parent_id_calendars CHECK (id <> parent_id);

ALTER TABLE
    dictionaries
ADD
    CONSTRAINT id_cannot_equal_parent_id_dictionaries CHECK (id <> parent_id);

ALTER TABLE
    random_tables
ADD
    CONSTRAINT id_cannot_equal_parent_id_random_tables CHECK (id <> parent_id);

-- migrate:down
ALTER TABLE
    documents DROP CONSTRAINT id_cannot_equal_parent_id_docs;

ALTER TABLE
    maps DROP CONSTRAINT id_cannot_equal_parent_id_maps;

ALTER TABLE
    graphs DROP CONSTRAINT id_cannot_equal_parent_id_graphs;

ALTER TABLE
    calendars DROP CONSTRAINT id_cannot_equal_parent_id_calendars;

ALTER TABLE
    dictionaries DROP CONSTRAINT id_cannot_equal_parent_id_dictionaries;

ALTER TABLE
    random_tables DROP CONSTRAINT id_cannot_equal_parent_id_random_tables;