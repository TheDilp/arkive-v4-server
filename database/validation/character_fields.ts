import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterFieldsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);

export const insertCharacterFieldsSchema = t.Object({
  data: t.Object({
    title: t.String(),
    sort: t.Optional(t.Number()),
    field_type: t.String(),
    parent_id: t.String(),
    options: t.Optional(t.Array(t.String())),
    formula: t.Optional(t.Union([t.String(), t.Null()])),
    random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});

export const UpdateCharacterFieldsSchema = t.Object({
  data: t.Object({
    title: t.String(),
    sort: t.Optional(t.Number()),
    field_type: t.String(),
    parent_id: t.String(),
    options: t.Optional(t.Array(t.String())),
    formula: t.Optional(t.Union([t.String(), t.Null()])),
    random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
