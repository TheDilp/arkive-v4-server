-- migrate:up
CREATE VIEW user_project_roles_permissions AS
SELECT
    COALESCE(A.user_id, P.owner_id) as user_id,
    A.project_id,
    P.owner_id,
    C.code as permission_slug
FROM
    projects AS P
    LEFT JOIN user_roles AS A ON P.id = A.project_id
    LEFT JOIN role_permissions AS B ON A.role_id = B.role_id
    LEFT JOIN permissions AS C ON B.permission_id = C.id;

-- migrate:down
DROP VIEW user_project_roles_permissions;