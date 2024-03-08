import { t } from "elysia";

export const BulkUpdateAccess = t.Object({
  data: t.Object({
    permissions: t.Array(
      t.Intersect([
        t.Object({ related_id: t.String() }),
        t.Union([
          t.Object({
            permission_id: t.String(),
            user_id: t.String(),
          }),
          t.Object({
            role_id: t.String(),
          }),
        ]),
      ]),
    ),
  }),
});
