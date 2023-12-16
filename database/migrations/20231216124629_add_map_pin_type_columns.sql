-- migrate:up
ALTER TABLE
    ONLY public.map_pin_types
ADD
    COLUMN default_icon TEXT;

ALTER TABLE
    ONLY public.map_pin_types
ADD
    COLUMN default_icon_color TEXT;

-- migrate:down
ALTER TABLE
    ONLY public.map_pin_types DROP COLUMN default_icon;

ALTER TABLE
    ONLY public.map_pin_types DROP COLUMN default_icon_color;