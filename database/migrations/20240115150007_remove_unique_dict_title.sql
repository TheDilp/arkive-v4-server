-- migrate:up
DROP INDEX dictionaries_project_id_title_key;

-- migrate:down
CREATE UNIQUE INDEX dictionaries_project_id_title_key ON public.dictionaries USING btree (project_id, title);