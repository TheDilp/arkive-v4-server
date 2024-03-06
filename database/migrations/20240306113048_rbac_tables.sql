-- migrate:up
CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    project_id UUID NOT NULL,
    CONSTRAINT unique_roles_constraint UNIQUE (title, project_id),
    CONSTRAINT roles_project_fkey_constraint FOREIGN KEY (project_id) REFERENCES projects (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE public."permissions" (
    id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_permissions_title_constraint UNIQUE (title),
    CONSTRAINT unique_permissions_code_constraint UNIQUE (code)
);

CREATE TABLE role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_role_permissions PRIMARY KEY (role_id, permission_id),
    CONSTRAINT role_permissions_permission_fkey_constraint FOREIGN KEY (permission_id) REFERENCES public."permissions" (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT role_permissions_roles_fkey_constraint FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    project_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_users_roles PRIMARY KEY (user_id, role_id, project_id),
    CONSTRAINT user_roles_role_fkey_constraint FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT user_roles_user_fkey_constraint FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT user_roles_project_fkey_constraint FOREIGN KEY (project_id) REFERENCES projects (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

-- migrate:down
DROP TABLE role_permissions;

DROP TABLE user_roles;

DROP TABLE roles;

DROP TABLE public."permissions";