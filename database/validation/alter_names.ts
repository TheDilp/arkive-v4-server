import { t } from "elysia";

export const InsertAlterNamesSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.String(),
    parent_id: t.String(),
  }),
});
