-- migrate:up
CREATE TABLE public.blueprint_instance_events (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);

ALTER TABLE
    ONLY public.blueprint_instance_events
ADD
    CONSTRAINT blueprint_instance_events_pkey PRIMARY KEY (
        blueprint_instance_id,
        blueprint_field_id,
        related_id
    );

ALTER TABLE
    ONLY public.blueprint_instance_events
ADD
    CONSTRAINT blueprint_instance_events_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Name: blueprint_instance_events blueprint_instance_events_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE
    ONLY public.blueprint_instance_events
ADD
    CONSTRAINT blueprint_instance_events_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Name: blueprint_instance_events blueprint_instance_events_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--
ALTER TABLE
    ONLY public.blueprint_instance_events
ADD
    CONSTRAINT blueprint_instance_events_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
DROP TABLE public.blueprint_instance_events;