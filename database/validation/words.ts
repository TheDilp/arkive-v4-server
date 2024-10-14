import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListWordSchema = t.Intersect([RequestBodySchema, t.Object({ data: t.Object({ parent_id: t.String() }) })]);

export const ReadWordSchema = RequestBodySchema;

export const InserWordSchema = t.Object({
  data: t.Object({
    title: t.String(),
    parent_id: t.String(),
    translation: t.String(),
    description: t.Optional(t.Union([t.String(), t.Null()])),
  }),
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

export const UpdateWordSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    transaltion: t.Optional(t.String()),
    description: t.Optional(t.Union([t.String(), t.Null()])),
    owner_id: t.Optional(t.String()),
  }),
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
