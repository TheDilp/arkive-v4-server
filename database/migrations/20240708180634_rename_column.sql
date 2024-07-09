-- migrate:up
DROP TABLE image_tags;

CREATE TABLE
    image_tags (
        related_id uuid NOT NULL REFERENCES images (id),
        tag_id uuid NOT NULL REFERENCES tags (id),
        id uuid DEFAULT gen_random_uuid () NOT NULL
    );

-- migrate:down
CREATE TABLE
    image_tags (
        related_id uuid NOT NULL REFERENCES images (id),
        tag_id uuid NOT NULL REFERENCES tags (id),
        id uuid DEFAULT gen_random_uuid () NOT NULL
    );