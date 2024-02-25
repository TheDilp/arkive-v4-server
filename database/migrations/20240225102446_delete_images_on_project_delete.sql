-- migrate:up
ALTER TABLE
    ONLY public.images DROP CONSTRAINT images_project_id_fkey;

ALTER TABLE
    ONLY public.images
ADD
    CONSTRAINT images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
ALTER TABLE
    ONLY public.images DROP CONSTRAINT images_project_id_fkey;

ALTER TABLE
    ONLY public.images
ADD
    CONSTRAINT images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE
SET
    NULL;