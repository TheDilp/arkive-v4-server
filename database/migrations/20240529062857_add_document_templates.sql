-- migrate:up
CREATE TABLE
    document_template_fields (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        parent_id UUID NOT NULL REFERENCES public.documents (id) ON DELETE CASCADE,
        key TEXT NOT NULL,
        value TEXT,
        formula TEXT,
        derive_from UUID REFERENCES public.document_template_fields (id) ON DELETE SET NULL,
        derive_formula TEXT,
        is_randomized BOOLEAN,
        entity_type TEXT NOT NULL CHECK (
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