import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListManuscriptSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()), documents: t.Optional(t.Boolean()) })),
  }),
]);

export const ReadManuscriptSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
          documents: t.Optional(t.Boolean()),
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
      documents: t.Array(t.Object({ doc_id: t.String(), parent_id: t.Union([t.Null(), t.String()]) })),
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
