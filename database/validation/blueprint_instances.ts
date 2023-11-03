import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ parent_id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          tags: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const ReadBlueprintInstanceSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Optional(
      t.Object({
        blueprint_fields: t.Optional(t.Boolean()),
        tags: t.Optional(t.Boolean()),
      }),
    ),
  }),
]);

export const InsertBlueprintInstanceSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    title: t.String(),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      blueprint_fields: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            value: t.Optional(
              t.Union([
                t.Object({
                  value: t.Optional(t.Union([t.String(), t.Number(), t.Boolean(), t.Null(), t.Record(t.String(), t.Any())])),
                }),
                t.Null(),
              ]),
            ),
          }),
        ),
      ),
    }),
  ),
});
export const UpdateBlueprintInstanceSchema = t.Object({
  data: t.Object({
    id: t.String(),
    title: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      blueprint_fields: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            value: t.Optional(
              t.Union([
                t.Object({
                  value: t.Optional(t.Union([t.String(), t.Number(), t.Boolean(), t.Null(), t.Record(t.String(), t.Any())])),
                }),
                t.Null(),
              ]),
            ),
          }),
        ),
      ),
    }),
  ),
});
