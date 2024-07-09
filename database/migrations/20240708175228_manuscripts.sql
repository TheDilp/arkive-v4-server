-- migrate:up
CREATE TABLE
    manuscripts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title TEXT NOT NULL,
        project_id UUID NOT NULL REFERENCES projects (id),
        is_public BOOLEAN,
        icon TEXT
    );

CREATE TABLE
    manuscript_trees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        manuscript_id UUID NOT NULL REFERENCES manuscripts (id),
        doc_id UUID NOT NULL REFERENCES documents (id),
        parent_id UUID REFERENCES documents (id)
    );

CREATE TABLE
    manuscript_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        tag_id UUID NOT NULL REFERENCES tags (id),
        related_id UUID NOT NULL REFERENCES manuscripts (id)
    );

-- migrate:down
DROP TABLE manuscript_trees;

DROP TABLE manuscript_tags;

DROP TABLE manuscripts;