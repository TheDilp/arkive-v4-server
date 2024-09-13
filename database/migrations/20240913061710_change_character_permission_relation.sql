-- migrate:up
ALTER TABLE ONLY public.game_character_permissions
DROP CONSTRAINT game_character_permissions_related_id_fkey;

ALTER TABLE ONLY public.game_character_permissions ADD CONSTRAINT game_character_permissions_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.game_characters (id) ON DELETE CASCADE;

-- migrate:down
ALTER TABLE ONLY public.game_character_permissions
DROP CONSTRAINT game_character_permissions_related_id_fkey;

ALTER TABLE ONLY public.game_character_permissions ADD CONSTRAINT game_character_permissions_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.characters (id) ON DELETE CASCADE;