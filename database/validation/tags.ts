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
  permissions: t.Optional(
    t.Array(
      t.Intersect([
        t.Object({ related_id: t.Optional(t.Null()) }),
        t.Union([
          t.Object({
            permission_id: t.String(),
            user_id: t.String(),
            role_id: t.Null(),
          }),
          t.Object({
            permission_id: t.Null(),
            user_id: t.Null(),
            role_id: t.String(),
          }),
        ]),
      ]),
    ),
  ),
});

export const UpdateTagSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
    color: t.Optional(t.String()),
  }),
  permissions: t.Optional(
    t.Array(
      t.Intersect([
        t.Object({ related_id: t.String() }),

        t.Union([
          t.Object({
            permission_id: t.String(),
            user_id: t.String(),
            role_id: t.Null(),
          }),
          t.Object({
            permission_id: t.Null(),
            user_id: t.Null(),
            role_id: t.String(),
          }),
        ]),
      ]),
    ),
  ),
});
