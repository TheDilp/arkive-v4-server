-- migrate:up
CREATE TABLE blueprint_instance_permissions (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    related_id UUID NOT NULL,
    permission_id UUID,
    role_id UUID,
    user_id UUID,
    CONSTRAINT blueprint_instance_permissions_bpi_fkey_constraint FOREIGN KEY (related_id) REFERENCES blueprint_instances (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT blueprint_instance_permissions_user_fkey_constraint FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT blueprint_instance_permissions_role_fkey_constraint FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT unique_blueprint_instance_role_combination UNIQUE (related_id, role_id),
    CONSTRAINT unique_blueprint_instance_user_permission_combination UNIQUE (related_id, user_id, permission_id),
    CONSTRAINT check_role_user_presence CHECK (
        (
            role_id IS NOT NULL
            AND user_id IS NULL
            AND permission_id IS NULL
        )
        OR (
            role_id IS NULL
            AND user_id IS NOT NULL
            AND permission_id IS NOT NULL
        )
    )
);

-- migrate:down
DROP TABLE blueprint_instance_permissions;