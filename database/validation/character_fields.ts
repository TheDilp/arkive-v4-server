import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

// const FieldWidthSchema = t.Union([t.Literal("full"), t.Literal("half")]);
const FieldTypeSchema = t.Union([
  t.Literal("text"),
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
]);

export const ListCharacterFieldsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ parent_id: t.String() }) }),
]);

export const insertCharacterFieldsSchema = t.Object({
  data: t.Object({
    title: t.String(),
    sort: t.Optional(t.Number()),
    field_type: FieldTypeSchema,
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
    field_type: FieldTypeSchema,
    parent_id: t.String(),
    options: t.Optional(t.Array(t.String())),
    formula: t.Optional(t.Union([t.String(), t.Null()])),
    random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
