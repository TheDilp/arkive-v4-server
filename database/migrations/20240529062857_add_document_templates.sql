-- migrate:up
CREATE TABLE
    document_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
        owner_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        deleted_at timestamp(3) without time zone,
        title TEXT NOT NULL,
        icon TEXT
    );

CREATE TABLE
    document_template_fields (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES public.document_templates (id) ON DELETE CASCADE,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        formula TEXT,
        derive_from UUID REFERENCES public.document_template_fields (id) ON DELETE SET NULL,
        derive_formula TEXT,
        is_randomized BOOLEAN,
        entity_type TEXT CHECK (
            entity_type IN (
                'characters',
                'blueprint_instances',
                'documents',
                'maps',
                'map_pins',
                'graphs',
                'dictionaries',
                'events',
                'calendars',
                'words',
                'random_tables',
                'dice_roll',
                'derived',
                'custom'
            )
        )
    );

-- migrate:down
DROP TABLE document_template_fields;

DROP TABLE document_templates;