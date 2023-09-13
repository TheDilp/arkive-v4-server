import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListWordSchema = t.Intersect([RequestBodySchema, t.Object({ data: t.Object({ parent_id: t.String() }) })]);
export const InserWordSchema = t.Object({
  data: t.Object({
    title: t.String(),
    parent_id: t.String(),
    translation: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});

export const UpdateWordSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    transaltion: t.Optional(t.String()),
    description: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
