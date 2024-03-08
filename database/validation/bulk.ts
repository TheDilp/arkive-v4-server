import { t } from "elysia";

export const BulkUpdateAccess = t.Object({
  data: t.Union([
    t.Object({
      permissions: t.Array(
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
    }),

    t.Object({
      permissions: t.Array(t.Object({ related_id: t.String(), permission_id: t.Null(), user_id: t.Null(), role_id: t.Null() })),
    }),
  ]),
});
