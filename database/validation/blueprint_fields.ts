import { t } from "elysia";

export const insertBlueprintFieldSchema = t.Object({
  title: t.String(),
  project_id: t.String(),
  sort: t.Optional(t.Number()),
  field_type: t.String(),
  parent_id: t.String(),
  options: t.Optional(t.Array(t.String())),
  formula: t.Optional(t.Union([t.String(), t.Null()])),
  random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
});

export const UpdateBlueprintFieldSchema = t.Object({
  title: t.String(),
  sort: t.Optional(t.Number()),
  field_type: t.String(),
  parent_id: t.String(),
  options: t.Optional(t.Array(t.String())),
  formula: t.Optional(t.Union([t.String(), t.Null()])),
  random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
});
