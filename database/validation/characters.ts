import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }) }),
  t.Optional(
    t.Object({
      relations: t.Optional(t.Object({ portrait: t.Optional(t.Boolean()), tags: t.Optional(t.Boolean()) })),
    }),
  ),
]);
export const ReadCharacterSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({}) }),
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          portrait: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          relationships: t.Optional(t.Boolean()),
          character_fields: t.Optional(t.Boolean()),
          documents: t.Optional(t.Boolean()),
          locations: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertCharacterSchema = t.Object({
  data: t.Object({
    first_name: t.String(),
    project_id: t.String(),
    last_name: t.Optional(t.Union([t.String(), t.Null()])),
    nickname: t.Optional(t.Union([t.String(), t.Null()])),
    age: t.Optional(t.Union([t.Number(), t.Null()])),
    portrait_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
    is_favorite: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      character_fields: t.Optional(t.Array(t.Object({ id: t.String(), value: t.String() }))),
      related_to: t.Optional(t.Array(t.Object({ id: t.String(), relation_type: t.String() }))),
      related_from: t.Optional(t.Array(t.Object({ id: t.String(), relation_type: t.String() }))),
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      documents: t.Optional(t.Array(t.Object({ id: t.String() }))),
      images: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
export const UpdateCharacterSchema = t.Object({
  data: t.Object({
    first_name: t.Optional(t.String()),
    last_name: t.Optional(t.Union([t.String(), t.Null()])),
    nickname: t.Optional(t.Union([t.String(), t.Null()])),
    age: t.Optional(t.Union([t.Number(), t.Null()])),
    portrait_id: t.Optional(t.Union([t.String(), t.Null()])),
    map_pin_id: t.Optional(t.Union([t.String(), t.Null()])),
    is_favorite: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      character_fields: t.Optional(t.Array(t.Object({ id: t.String(), value: t.String() }))),
      related_to: t.Optional(t.Array(t.Object({ id: t.String(), relation_type: t.String() }))),
      related_from: t.Optional(t.Array(t.Object({ id: t.String(), relation_type: t.String() }))),
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      documents: t.Optional(t.Array(t.Object({ id: t.String() }))),
      images: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
