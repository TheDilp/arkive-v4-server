import { t } from "elysia";

export const InsertRelationshipTypeSchema = t.Object({
  data: t.Object({
    title: t.String(),
    project_id: t.String(),
    ascendant_title: t.String(),
    descendant_title: t.String(),
  }),
});
