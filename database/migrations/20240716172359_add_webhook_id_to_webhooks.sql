-- migrate:up
ALTER TABLE webhooks
ADD COLUMN webhook_id TEXT NOT NULL;

-- migrate:down
ALTER TABLE webhooks
DROP COLUMN webhook_id;