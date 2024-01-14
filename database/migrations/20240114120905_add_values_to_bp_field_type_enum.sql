-- migrate:up
ALTER TYPE public."BlueprintFieldType"
ADD
    VALUE 'events_single';

ALTER TYPE public."BlueprintFieldType"
ADD
    VALUE 'events_multiple';

-- migrate:down