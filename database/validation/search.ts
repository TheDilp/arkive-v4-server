import { t } from "elysia";

export const BasicSearchSchema = t.Object({
  data: t.Object({ search_term: t.String(), project_id: t.String(), parent_id: t.Optional(t.Union([t.Null(), t.String()])) }),
  limit: t.Optional(t.Number()),
});

export const CategorySearchSchema = t.Object({ data: t.Object({ search_term: t.String() }), limit: t.Optional(t.Number()) });

export const TagSearchSchema = t.Object({
  data: t.Object({
    tag_ids: t.Array(t.String()),
    match: t.Union([t.Literal("all"), t.Literal("any")]),
  }),
  limit: t.Optional(t.Number()),
});

export const GatewaySearchSchema = t.Object({
  data: t.Object({
    access_id: t.String(),
    entity_type: t.Union([t.Literal("characters"), t.Literal("blueprint_instances")]),
    parent_id: t.Optional(t.String()),
  }),
});
export const GatewayMentionSearchSchema = t.Object({
  data: t.Object({
    search_term: t.String(),
    access_id: t.String(),
    entity_type: t.Union([t.Literal("characters"), t.Literal("blueprint_instances")]),
  }),
});
