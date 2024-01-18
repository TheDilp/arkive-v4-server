-- migrate:up
ALTER TABLE
    public."_charactersTodocuments"
ADD
    COLUMN is_main_page BOOLEAN;

-- migrate:down
ALTER TABLE
    public."_charactersTodocuments" DROP COLUMN is_main_page;