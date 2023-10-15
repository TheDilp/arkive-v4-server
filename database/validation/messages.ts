import { t } from "elysia";

export const InsertMessageSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    sender_id: t.Optional(t.String()),
    content: t.String(),
    type: t.String(),
  }),
  project_id: t.String(),
  conversation: t.Optional(
    t.Object({
      id: t.String(),
      title: t.String(),
    }),
  ),
});
