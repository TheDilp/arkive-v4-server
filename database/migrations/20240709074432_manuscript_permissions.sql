-- migrate:up
INSERT INTO
    permissions (title, code, parent_category)
VALUES
    ('Read manuscripts', 'read_manuscripts', 2),
    ('Update manuscripts', 'update_manuscripts', 2),
    ('Create manuscripts', 'create_manuscripts', 2),
    ('Delete manuscripts', 'delete_manuscripts', 2);

-- migrate:down
DELETE FROM permissions
WHERE
    code ILIKE '%manuscripts%';