-- migrate:up
CREATE TABLE
    image_tags (
        image_id UUID NOT NULL REFERENCES images (id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
        UNIQUE (image_id, tag_id)
    );

-- migrate:down
DROP TABLE image_tags;