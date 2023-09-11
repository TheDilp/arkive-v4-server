import { t } from "elysia";
import { RequestBodySchema } from "../../types/requestTypes";

export const ListCharacterFieldsTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
  }),
  t.Optional(
    t.Object({
      relations: t.Optional(t.Object({ character_fields: t.Boolean() })),
    }),
  ),
]);

export const ReadCharacterFieldsTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ id: t.String() }),
    relations: t.Object({ character_fields: t.Boolean() }),
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
          project_id: t.String(),
          field_type: t.String(),
          sort: t.Optional(t.Number()),
          formula: t.Optional(t.Union([t.String(), t.Null()])),
          options: t.Optional(t.Array(t.String())),
          random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
        }),
      ),
    }),
  ),
});

export const UpdateCharacterFieldsTemplateSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    sort: t.Optional(t.Number()),
  }),
  relations: t.Optional(
    t.Object({
      character_fields: t.Array(
        t.Object({
          id: t.String(),
          title: t.String(),
          project_id: t.String(),
          field_type: t.String(),
          sort: t.Optional(t.Number()),
          formula: t.Optional(t.Union([t.String(), t.Null()])),
          options: t.Optional(t.Array(t.String())),
          random_table_id: t.Optional(t.Union([t.String(), t.Null()])),
        }),
      ),
    }),
  ),
});
