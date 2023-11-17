-- migrate:up
CREATE TABLE public.document_mentions (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    parent_document_id UUID NOT NULL,
    mention_id UUID NOT NULL
);

-- migrate:down
DROP TABLE public.document_mentions;
