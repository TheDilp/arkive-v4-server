-- migrate:up
-- Assume your ENUM is named 'status_type' and you want to add a new value 'new_value'
ALTER TYPE "MentionTypeEnum"
ADD
    VALUE 'map_pins';

-- migrate:down