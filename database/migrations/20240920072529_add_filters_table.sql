-- migrate:up
CREATE TABLE
    filters (
        id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
        title TEXT NOT NULL,
        project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
        content JSONB NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('characters', 'blueprint_instances')) -- Closing parenthesis for CHECK constraint
    );

-- migrate:down
DROP TABLE filters;