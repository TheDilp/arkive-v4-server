import { t } from "elysia";

export const InsertBlueprintInstanceSchema = t.Object({
  data: t.Object({
    blueprint_id: t.String(),
    value: t.Optional(t.Union([t.Any(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
export const UpdateBlueprintInstanceSchema = t.Object({
  data: t.Object({
    value: t.Optional(t.Union([t.Any(), t.Null()])),
  }),
  //   relations: t.Optional(
  //     t.Object({
  //       blueprint_fields: t.Array(
  //         t.Object({
  //           title: t.String(),
  //           field_type: FieldTypeSchema,
  //           width: FieldWidthSchema,
  //           sort: t.Optional(t.Number()),
  //           formula: t.Optional(t.Union([t.String(), t.Null()])),
  //           options: t.Optional(t.Array(t.Object({ id: t.String(), value: t.String() }))),
  //           random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
  //           calendar_id: t.Optional(t.Union([t.String(), t.Null()])),
  //         }),
  //       ),
  //       tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
  //     }),
  //   ),
});
