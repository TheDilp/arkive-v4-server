-- migrate:up
CREATE VIEW user_project_roles_permissions AS
SELECT
    A.user_id,
    A.project_id,
    P.owner_id,
    C.code as permission_slug
FROM
    user_roles AS A
    LEFT JOIN role_permissions AS B ON A.role_id = B.role_id
    LEFT JOIN permissions AS C on B.permission_id = C.id
    LEFT JOIN projects AS P on A.project_id = P.id;

-- migrate:down
DROP VIEW user_project_roles_permissions;