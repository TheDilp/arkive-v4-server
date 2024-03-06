import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListRoleSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(t.Object({ relations: t.Optional(t.Object({ permissions: t.Optional(t.Boolean()) })) })),
  t.Object({
    data: t.Object({
      project_id: t.String(),
    }),
  }),
]);

export const InsertRoleSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    permissions: t.Array(t.String(), { minItems: 1 }),
  }),
});
