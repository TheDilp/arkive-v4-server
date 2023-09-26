import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterRelationshipTypeSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }) }),
]);

export const InsertRelationshipTypeSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    ascendant_title: t.Optional(t.Union([t.String(), t.Null()])),
    descendant_title: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
