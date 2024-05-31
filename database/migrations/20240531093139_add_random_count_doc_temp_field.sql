-- migrate:up
ALTER TABLE document_template_fields
ADD COLUMN random_count TEXT CHECK (
    random_count IN (
        'single',
        'max_2',
        'max_3',
        'max_4',
        'max_5',
        'max_6',
        'max_7',
        'max_8',
        'max_9',
        'max_10',
        'max_11',
        'max_12',
        'max_13',
        'max_14',
        'max_15',
        'max_16',
        'max_17',
        'max_18',
        'max_19',
        'max_20'
    )
);

-- migrate:down
ALTER TABLE document_template_fields
DROP COLUMN random_count;