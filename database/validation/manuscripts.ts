import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

const ManuscriptEntitySchema = t.Object({
  id: t.Optional(t.String()),
  parent_id: t.Union([t.Null(), t.String()]),
  manuscript_id: t.String(),
  document_id: t.Union([t.Null(), t.String()]),
  character_id: t.Union([t.Null(), t.String()]),
  blueprint_instance_id: t.Union([t.Null(), t.String()]),
  map_id: t.Union([t.Null(), t.String()]),
  map_pin_id: t.Union([t.Null(), t.String()]),
  graph_id: t.Union([t.Null(), t.String()]),
  event_id: t.Union([t.Null(), t.String()]),
  image_id: t.Union([t.Null(), t.String()]),
  sort: t.Number(),
});

export const ListManuscriptSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()), entities: t.Optional(t.Boolean()) })),
  }),
]);

export const ReadManuscriptSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          entities: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertManuscriptSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.String(),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      entities: t.Array(ManuscriptEntitySchema),
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
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

export const UpdateManuscriptSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      entities: t.Array(ManuscriptEntitySchema),
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
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
