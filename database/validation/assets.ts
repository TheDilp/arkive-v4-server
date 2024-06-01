import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListAssetsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })) }),
]);
export const ReadAssetsSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })) }),
]);

export const UpdateImageSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
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

export const UploadImageSchema = t.Record(
  t.String(),
  t.Union([
    t.File({ maxSize: "100m" }),
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
    t.Null(),
  ]),
);
