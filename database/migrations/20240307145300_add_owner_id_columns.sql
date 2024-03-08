-- migrate:up
ALTER TABLE
    characters
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    blueprints
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    blueprint_instances
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    documents
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    maps
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    graphs
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    calendars
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    dictionaries
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    tags
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    images
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    random_tables
ADD
    COLUMN owner_id UUID;

ALTER TABLE
    character_fields_templates
ADD
    COLUMN owner_id UUID;

UPDATE
    characters
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    characters.project_id = projects.id;

UPDATE
    blueprints
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    blueprints.project_id = projects.id;

WITH updated_data AS (
    SELECT
        bi.id AS bi_id,
        p.owner_id AS new_owner_id
    FROM
        blueprint_instances AS bi
        JOIN blueprints AS b ON b.id = bi.parent_id
        JOIN projects AS p ON b.project_id = p.id
)
UPDATE
    blueprint_instances AS bi
SET
    owner_id = ud.new_owner_id
FROM
    updated_data AS ud
WHERE
    bi.id = ud.bi_id;

UPDATE
    documents
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    documents.project_id = projects.id;

UPDATE
    maps
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    maps.project_id = projects.id;

UPDATE
    graphs
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    graphs.project_id = projects.id;

UPDATE
    calendars
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    calendars.project_id = projects.id;

UPDATE
    dictionaries
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    dictionaries.project_id = projects.id;

UPDATE
    tags
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    tags.project_id = projects.id;

UPDATE
    images
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    images.project_id = projects.id;

UPDATE
    random_tables
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    random_tables.project_id = projects.id;

UPDATE
    character_fields_templates
SET
    owner_id = projects.owner_id
FROM
    projects
WHERE
    character_fields_templates.project_id = projects.id;

-- migrate:down
ALTER TABLE
    characters DROP COLUMN owner_id;

ALTER TABLE
    blueprints DROP COLUMN owner_id;

ALTER TABLE
    blueprint_instances DROP COLUMN owner_id;

ALTER TABLE
    documents DROP COLUMN owner_id;

ALTER TABLE
    maps DROP COLUMN owner_id;

ALTER TABLE
    graphs DROP COLUMN owner_id;

ALTER TABLE
    calendars DROP COLUMN owner_id;

ALTER TABLE
    dictionaries DROP COLUMN owner_id;

ALTER TABLE
    tags DROP COLUMN owner_id;

ALTER TABLE
    images DROP COLUMN owner_id;

ALTER TABLE
    random_tables DROP COLUMN owner_id;

ALTER TABLE
    character_fields_templates DROP COLUMN owner_id;