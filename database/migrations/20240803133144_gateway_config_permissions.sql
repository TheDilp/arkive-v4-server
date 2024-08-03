-- migrate:up
INSERT INTO
    permissions (title, code, parent_category)
VALUES
    ('Read gateway configurations', 'read_gateway_configurations', 10),
    ('Update gateway configurations', 'update_gateway_configurations', 10),
    ('Create gateway configurations', 'create_gateway_configurations', 10),
    ('Delete gateway configurations', 'delete_gateway_configurations', 10);

-- migrate:down
DELETE FROM permissions
WHERE
    code ILIKE '%gateway_configurations%';