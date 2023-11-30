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

export const SendWebhookSchema = t.Object({
  data: t.Union([
    t.Object({ title: t.String(), description: t.String(), type: t.Literal("document_text") }),
    t.Object({
      title: t.String(),
      description: t.Optional(t.String()),
      type: t.Union([t.Literal("random_table_roll")]),
    }),
    t.Object({
      id: t.String(),
      type: t.Union([
        t.Literal("characters"),
        t.Literal("blueprint_instances"),
        t.Literal("documents"),
        t.Literal("maps"),
        t.Literal("graphs"),
        t.Literal("dictionaries"),
        t.Literal("images"),
        t.Literal("words"),
      ]),
    }),
  ]),
});
