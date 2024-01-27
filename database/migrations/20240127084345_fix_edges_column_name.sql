-- migrate:up
ALTER TABLE
    public.edges RENAME COLUMN mid_target_arrlow_fill TO mid_target_arrow_fill;

ALTER TABLE
    public.edges RENAME COLUMN mid_target_arrlow_color TO mid_target_arrow_color;

-- migrate:down
ALTER TABLE
    public.edges RENAME COLUMN mid_target_arrow_fill TO mid_target_arrlow_fill;

ALTER TABLE
    public.edges RENAME COLUMN mid_target_arrow_color TO mid_target_arrlow_color;