import { t } from "elysia";
import { Boards } from "kysely-codegen";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListGraphSchema = RequestBodySchema;
export const ReadGraphSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          nodes: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          edges: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertGraphSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    parent_id: t.Optional(t.String()),
    title: t.Optional(t.String()),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.String()),
    default_node_shape: t.Optional(t.String()),
    default_node_color: t.Optional(t.String()),
    default_edge_color: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export const UpdateGraphSchema = t.Object({
  data: t.Object({
    id: t.Optional(t.String()),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    title: t.Optional(t.String()),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.Boolean(), t.Null()])),
    default_node_shape: t.Optional(t.String()),
    default_node_color: t.Optional(t.String()),
    default_edge_color: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});

export type BoardColumns = keyof Boards;
