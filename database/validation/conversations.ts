import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadConversationSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          characters: t.Optional(t.Boolean()),
          messages: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);
export const ListConversationSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }) }),
  t.Object({ relations: t.Object({ characters: t.Optional(t.Boolean()), messages: t.Optional(t.Boolean()) }) }),
]);

export const InsertConversationSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
  }),
  relations: t.Object({
    characters: t.Array(
      t.Object({
        id: t.String(),
      }),
    ),
  }),
});
export const UpdateConversationSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
      characters: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
      ),
    }),
  ),
});
