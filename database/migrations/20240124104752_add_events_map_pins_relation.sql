-- migrate:up
CREATE TABLE public."event_map_pins" (
    "event_id" uuid NOT NULL,
    "map_pin_id" uuid NOT NULL
);

CREATE UNIQUE INDEX "event_map_pin_unique" ON public."event_map_pins" USING btree ("event_id", "map_pin_id");

ALTER TABLE
    ONLY public."event_map_pins"
ADD
    CONSTRAINT "event_map_pins_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
    ONLY public."event_map_pins"
ADD
    CONSTRAINT "event_map_pins_map_pin_id_fkey" FOREIGN KEY ("map_pin_id") REFERENCES public.map_pins(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- migrate:down
DROP TABLE public."event_map_pins";