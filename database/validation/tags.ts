import { t } from "elysia";

export const InsertTagSchema = t.Union([
  t.Object({
    title: t.String(),
    color: t.String(),
    project_id: t.String(),
  }),
  t.Array(
    t.Object({
      title: t.String(),
      color: t.String(),
      project_id: t.String(),
    }),
  ),
]);

export const UpdateTagSchema = t.Object({
  id: t.String(),
  title: t.Optional(t.String()),
  color: t.Optional(t.String()),
});
