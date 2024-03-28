import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

const FieldTypeSchema = t.Union([
  t.Literal("text"),
  t.Literal("textarea"),
  t.Literal("boolean"),
  t.Literal("number"),
  t.Literal("select"),
  t.Literal("select_multiple"),
  t.Literal("dice_roll"),
  t.Literal("date"),
  t.Literal("random_table"),
  t.Literal("documents_single"),
  t.Literal("documents_multiple"),
  t.Literal("images_single"),
  t.Literal("images_multiple"),
  t.Literal("locations_single"),
  t.Literal("locations_multiple"),
  t.Literal("blueprints_single"),
  t.Literal("blueprints_multiple"),
  t.Literal("events_single"),
  t.Literal("events_multiple"),
]);

export const ListCharacterFieldsTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(t.Object({ character_fields: t.Optional(t.Boolean()), tags: t.Optional(t.Boolean()) })),
    }),
  ),
]);

export const ReadCharacterFieldsTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Object({ character_fields: t.Optional(t.Boolean()), tags: t.Optional(t.Boolean()) }),
  }),
]);

export const InsertCharacterFieldsTemplateSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.String(),
    sort: t.Optional(t.Number()),
  }),
  relations: t.Optional(
    t.Object({
      character_fields: t.Array(
        t.Object({
          title: t.String(),
          field_type: FieldTypeSchema,
          sort: t.Optional(t.Number()),
          formula: t.Optional(t.Union([t.String(), t.Null()])),
          options: t.Optional(t.Array(t.Object({ id: t.String(), value: t.String() }))),
          random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
          calendar_id: t.Optional(t.Union([t.String(), t.Null()])),
        }),
      ),
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

export const UpdateTemplateSchema = t.Object({
  data: t.Object({
    id: t.Optional(t.String()),
    title: t.Optional(t.String()),
    sort: t.Optional(t.Number()),
  }),
  relations: t.Optional(
    t.Object({
      character_fields: t.Array(
        t.Object({
          id: t.String(),
          title: t.String(),
          field_type: FieldTypeSchema,
          sort: t.Optional(t.Number()),
          formula: t.Optional(t.Union([t.String(), t.Null()])),
          options: t.Optional(t.Array(t.Object({ id: t.String(), value: t.String() }))),
          random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
          calendar_id: t.Optional(t.Union([t.String(), t.Null()])),
        }),
      ),
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
