import { t } from "elysia";

const MessageTypeEnum = t.Union([t.Literal("character"), t.Literal("narration"), t.Literal("place")]);

export const InsertMessageSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    sender_id: t.Optional(t.String()),
    type: MessageTypeEnum,
  }),
});
