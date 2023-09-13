import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadDictionarySchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          words: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertDictionarySchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const UpdateDictionarySchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
