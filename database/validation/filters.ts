import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListFilterSchema = t.Intersect([RequestBodySchema]);

export const ReadFilterSchema = t.Intersect([RequestBodySchema]);

export const InsertFilterSchema = t.Object({
  data: t.Object({
    title: t.String(),
    content: t.Any(),
    is_favorite: t.Optional(t.Boolean()),
    type: t.Union([t.Literal("characters"), t.Literal("blueprint_instances")]),
  }),
});

export const UpdateFilterSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    content: t.Optional(t.Any()),
    is_favorite: t.Optional(t.Boolean()),
  }),
});
