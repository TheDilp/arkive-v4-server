import { t } from "elysia";

export const InsertRoleSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    permissions: t.Array(t.String(), { minItems: 1 }),
  }),
});
