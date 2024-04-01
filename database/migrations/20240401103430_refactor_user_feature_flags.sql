-- migrate:up
CREATE TABLE user_project_feature_flags (
    user_id UUID NOT NULL,
    project_id UUID NOT NULL,
    feature_flags JSONB,
    CONSTRAINT "user_project_ff_user_fkey" FOREIGN KEY ("user_id") REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT "user_project_ff_project_fkey" FOREIGN KEY ("project_id") REFERENCES public.projects(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
);

-- migrate:down
DROP TABLE user_project_feature_flags;