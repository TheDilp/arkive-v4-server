import { t } from "elysia";

export const InsertMessageSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    sender_id: t.Optional(t.String()),
    content: t.String({ minLength: 1 }),
    type: t.Union([t.Literal("character"), t.Literal("place"), t.Literal("narration")]),
  }),
  project_id: t.String(),
  conversation: t.Optional(
    t.Object({
      id: t.String(),
      title: t.String(),
    }),
  ),
});
