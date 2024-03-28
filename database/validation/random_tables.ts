import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadRandomTableSchema = t.Intersect([
  RequestBodySchema,

  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          random_table_options: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertRandomTableSchema = t.Object({
  data: t.Object({
    title: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    project_id: t.String(),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      random_table_options: t.Array(
        t.Object({
          data: t.Object({ title: t.String(), description: t.Optional(t.Union([t.String(), t.Null()])) }),
        }),
      ),
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
export const UpdateRandomTableSchema = t.Object({
  data: t.Object({
    title: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      random_table_options: t.Array(
        t.Object({
          data: t.Object({ id: t.String(), title: t.String(), description: t.Optional(t.Union([t.String(), t.Null()])) }),
        }),
      ),
    }),
  ),
});
