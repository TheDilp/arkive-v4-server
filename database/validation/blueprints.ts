import { t } from "elysia";

export const InsertBlueprintTemplateSchema = t.Object({
  data: t.Object({
    id: t.Optional(t.String()),
    sort: t.Optional(t.Number()),
    project_id: t.String(),
    title: t.Optional(t.String()),
  }),
});
export const UpdateBlueprintTemplateSchema = t.Object({
  id: t.Optional(t.String()),
  sort: t.Optional(t.Number()),
  title: t.Optional(t.String()),
});
