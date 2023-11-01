import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

// const FieldWidthSchema = t.Union([t.Literal("full"), t.Literal("half")]);
const FieldTypeSchema = t.Union([
  t.Literal("text"),
  t.Literal("textarea"),
  t.Literal("number"),
  t.Literal("select"),
  t.Literal("select_multiple"),
  t.Literal("dice_roll"),
  t.Literal("date"),
  t.Literal("random_table"),
  t.Literal("documents_single"),
  t.Literal("documents_multiple"),
  t.Literal("images_single"),
  t.Literal("images_multiple"),
  t.Literal("locations_single"),
  t.Literal("locations_multiple"),
  t.Literal("characters_single"),
  t.Literal("characters_multiple"),
]);

export const ListBlueprintSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          blueprint_fields: t.Optional(t.Boolean()),

          // tags: t.Optional(t.Boolean())
        }),
      ),
    }),
  ),
]);

export const ReadBlueprintSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Object({
      blueprint_fields: t.Optional(t.Boolean()),
      blueprint_instances: t.Optional(t.Boolean()),
      random_table_options: t.Optional(t.Boolean()),

      // tags: t.Optional(t.Boolean())
    }),
  }),
]);

export const InsertBlueprintSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.String(),
    title_name: t.String(),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    // title_width: FieldWidthSchema,
  }),
  relations: t.Optional(
    t.Object({
      blueprint_fields: t.Array(
        t.Object({
          title: t.String(),
          field_type: FieldTypeSchema,
          // width: FieldWidthSchema,
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
  data: t.Object({
    title: t.Optional(t.String()),
    title_name: t.Optional(t.String()),
    icon: t.Optional(t.Union([t.String(), t.Null()])),

    // title_width: t.Optional(FieldWidthSchema),
  }),
  relations: t.Optional(
    t.Object({
      blueprint_fields: t.Array(
        t.Object({
          title: t.String(),
          field_type: FieldTypeSchema,
          // width: FieldWidthSchema,
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
