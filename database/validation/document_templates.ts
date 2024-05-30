import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

const DocumentTemplateEntityTypes = t.Union([
  t.Literal("characters"),
  t.Literal("blueprint_instances"),
  t.Literal("documents"),
  t.Literal("maps"),
  t.Literal("map_pins"),
  t.Literal("graphs"),
  t.Literal("dictionaries"),
  t.Literal("events"),
  t.Literal("calendars"),
  t.Literal("words"),
  t.Literal("random_tables"),
  t.Literal("dice_roll"),
  t.Literal("derived"),
  t.Literal("custom"),
]);

export const ReadDocumentTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          fields: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);
export const ListDocumentTemplateSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(t.Object({ fields: t.Optional(t.Boolean()) })),
  }),
]);

export const InsertDocumentTemplateSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.String(),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Object({}),
});
export const UpdateDocumentTemplateSchema = t.Object({
  data: t.Object({
    title: t.String(),
    // icon: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Object({
    fields: t.Array(
      t.Object({
        data: t.Object({
          id: t.String(),
          key: t.String(),
          value: t.String(),
          formula: t.Union([t.Null(), t.String()]),
          derive_from: t.Union([t.Null(), t.String()]),
          derive_formula: t.Union([t.Null(), t.String()]),
          entity_type: DocumentTemplateEntityTypes,
          is_randomized: t.Union([t.Boolean(), t.Null()]),
        }),
      }),
      { minItems: 1 },
    ),
  }),
});
