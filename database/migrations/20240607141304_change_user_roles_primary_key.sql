-- migrate:up
ALTER TABLE ONLY public.user_roles
DROP CONSTRAINT pk_users_roles;

ALTER TABLE ONLY public.user_roles ADD CONSTRAINT pk_users_roles PRIMARY KEY (user_id, project_id);

-- migrate:down
ALTER TABLE ONLY public.user_roles
DROP CONSTRAINT pk_users_roles;

ALTER TABLE ONLY public.user_roles ADD CONSTRAINT pk_users_roles PRIMARY KEY (user_id, role_id, project_id);