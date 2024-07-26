import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

const ManuscriptEntitySchema = t.Object({
  id: t.String(),
  related_id: t.String(),
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
      characters: t.Array(ManuscriptEntitySchema),
      blueprint_instances: t.Array(ManuscriptEntitySchema),
      documents: t.Array(ManuscriptEntitySchema),
      maps: t.Array(ManuscriptEntitySchema),
      map_pins: t.Array(ManuscriptEntitySchema),
      graphs: t.Array(ManuscriptEntitySchema),
      events: t.Array(ManuscriptEntitySchema),
      images: t.Array(ManuscriptEntitySchema),
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
    deleted_at: t.Optional(t.Union([t.String(), t.Null()])),
    title: t.Optional(t.String()),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      characters: t.Array(ManuscriptEntitySchema),
      blueprint_instances: t.Array(ManuscriptEntitySchema),
      documents: t.Array(ManuscriptEntitySchema),
      maps: t.Array(ManuscriptEntitySchema),
      map_pins: t.Array(ManuscriptEntitySchema),
      graphs: t.Array(ManuscriptEntitySchema),
      events: t.Array(ManuscriptEntitySchema),
      images: t.Array(ManuscriptEntitySchema),
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
