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
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          portrait: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          character_relationship_types: t.Optional(t.Boolean()),
          relationships: t.Optional(t.Boolean()),
          character_fields: t.Optional(t.Boolean()),
          documents: t.Optional(t.Boolean()),
          images: t.Optional(t.Boolean()),
          locations: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const GenerateCharacterRelationshipTreeSchema = t.Object({
  data: t.Object({
    direct_only: t.Optional(t.Boolean()),
  }),
});

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
      character_fields: t.Optional(
        t.Array(
          t.Object({ id: t.String(), value: t.Object({ value: t.Optional(t.Union([t.String(), t.Number(), t.Null()])) }) }),
        ),
      ),
      related_to: t.Optional(t.Array(t.Object({ id: t.String(), relation_type_id: t.String() }))),
      related_from: t.Optional(t.Array(t.Object({ id: t.String(), relation_type_id: t.String() }))),
      related_other: t.Optional(t.Array(t.Object({ id: t.String(), relation_type_id: t.String() }))),
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
      character_fields: t.Optional(
        t.Array(
          t.Object({ id: t.String(), value: t.Object({ value: t.Optional(t.Union([t.String(), t.Number(), t.Null()])) }) }),
        ),
      ),
      related_to: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            relation_type_id: t.String(),
            character_relationship_id: t.Optional(t.String({ minLength: 0 })),
          }),
        ),
      ),
      related_from: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            relation_type_id: t.String(),
            character_relationship_id: t.Optional(t.String({ minLength: 0 })),
          }),
        ),
      ),
      related_other: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            relation_type_id: t.String(),
            character_relationship_id: t.Optional(t.String({ minLength: 0 })),
          }),
        ),
      ),
      tags: t.Optional(t.Array(t.Object({ id: t.String() }))),
      documents: t.Optional(t.Array(t.Object({ id: t.String() }))),
      images: t.Optional(t.Array(t.Object({ id: t.String() }))),
    }),
  ),
});
