-- migrate:up
ALTER TABLE ONLY public.document_mentions
    ADD CONSTRAINT document_mentions_pkey PRIMARY KEY (id);

-- migrate:down

