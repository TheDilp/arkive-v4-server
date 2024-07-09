-- migrate:up
ALTER TABLE manuscript_trees
ADD COLUMN sort INT;

-- migrate:down
ALTER TABLE manuscript_trees
DROP COLUMN sort;