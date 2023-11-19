import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListWebhookSchema = t.Intersect([RequestBodySchema, t.Object({ data: t.Object({ user_id: t.String() }) })]);

export const ReadWebhookSchema = t.Intersect([RequestBodySchema, t.Object({ data: t.Object({ id: t.String() }) })]);

export const InsertWebhookSchema = t.Object({
  data: t.Object({
    title: t.String(),
    url: t.String(),
    user_id: t.String(),
  }),
});
