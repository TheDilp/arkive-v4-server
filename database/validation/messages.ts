import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadMessageSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ id: t.String() }) }),
  t.Optional(t.Object({ relations: t.Optional(t.Object({ character: t.Boolean() })) })),
]);
export const ListMessagesSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ conversation_id: t.String() }) }),
]);

export const InsertMessageSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    sender_id: t.Optional(t.String()),
    content: t.Union([
      t.Any(),
      t.Object({
        id: t.String(),
        title: t.String(),
        image_id: t.Optional(t.Union([t.String(), t.Null()])),
        icon: t.Optional(t.Union([t.String(), t.Null()])),
        parent_id: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    ]),
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

export const UpdateMessageSchema = t.Object({
  data: t.Object({
    id: t.String(),
    content: t.Union([
      t.Any(),
      t.Object({
        id: t.String(),
        title: t.String(),
        image_id: t.Optional(t.Union([t.String(), t.Null()])),
        icon: t.Optional(t.Union([t.String(), t.Null()])),
        parent_id: t.Optional(t.Union([t.String(), t.Null()])),
      }),
    ]),
  }),
});
