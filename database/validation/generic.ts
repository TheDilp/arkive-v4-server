import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const EntityListSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String(), parent_id: t.Optional(t.String()) }) }),
]);
