-- migrate:up
ALTER TABLE projects
DROP COLUMN default_dice_color;

-- migrate:down
ALTER TABLE projects
ADD COLUMN default_dice_color TEXT;