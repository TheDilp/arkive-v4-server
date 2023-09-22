import { t } from "elysia";

export const InsertTagSchema = t.Object({
  data: t.Union([
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
  ]),
});

export const UpdateTagSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    color: t.Optional(t.String()),
  }),
});
