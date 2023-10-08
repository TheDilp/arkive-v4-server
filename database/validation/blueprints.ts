import { t } from "elysia";

export const InsertBlueprintSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.String(),
  }),
  relations: t.Optional(
    t.Object({
      character_fields: t.Array(
        t.Object({
          title: t.String(),
          project_id: t.String(),
          field_type: t.String(),
          sort: t.Optional(t.Number()),
          formula: t.Optional(t.Union([t.String(), t.Null()])),
          options: t.Optional(t.Array(t.Object({ id: t.String(), value: t.String() }))),
          random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
          calendar_id: t.Optional(t.Union([t.String(), t.Null()])),
        }),
      ),
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
export const UpdateBlueprintSchema = t.Object({
  id: t.Optional(t.String()),
  sort: t.Optional(t.Number()),
  title: t.Optional(t.String()),
});
