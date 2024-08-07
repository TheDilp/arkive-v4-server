import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const DocumentTemplateEntityTypes = t.Union([
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

export const ReadDocumentSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          alter_names: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
          children: t.Optional(t.Boolean()),
          parents: t.Optional(t.Boolean()),
          image: t.Optional(t.Boolean()),
          template_fields: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);
export const ListDocumentSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({ project_id: t.String() }),
    relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()), image: t.Optional(t.Boolean()) })),
  }),
]);

export const InsertDocumentSchema = t.Object({
  data: t.Object({
    // id is optional as it is usually auto-generated
    // but must be sent when creating mentions from
    // existing document text content
    id: t.Optional(t.String()),
    project_id: t.String(),
    title: t.Optional(t.String()),
    content: t.Optional(t.Union([t.Any(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_template: t.Optional(t.Union([t.Boolean(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    dice_color: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(
    t.Object({
      alter_names: t.Optional(
        t.Array(
          t.Object({
            title: t.String(),
          }),
        ),
      ),
      template_fields: t.Optional(
        t.Array(
          t.Object({
            key: t.String(),
            blueprint_id: t.Optional(t.Union([t.Null(), t.String()])),
            map_id: t.Optional(t.Union([t.Null(), t.String()])),
            calendar_id: t.Optional(t.Union([t.Null(), t.String()])),
            dictionary_id: t.Optional(t.Union([t.Null(), t.String()])),
            value: t.Union([t.Null(), t.String()]),
            formula: t.Union([t.Null(), t.String()]),
            derive_from: t.Union([t.Null(), t.String()]),
            derive_formula: t.Union([t.Null(), t.String()]),
            entity_type: DocumentTemplateEntityTypes,
            is_randomized: t.Union([t.Boolean(), t.Null()]),
            random_count: t.Optional(t.Union([t.String(), t.Null()])),
            sort: t.Number({ default: 0 }),
            related: t.Array(t.String()),
          }),
        ),
      ),
      tags: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
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
export const UpdateDocumentSchema = t.Object({
  data: t.Object({
    id: t.String(),
    deleted_at: t.Optional(t.Union([t.String(), t.Null()])),
    title: t.Optional(t.String()),
    content: t.Optional(t.Union([t.Any(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_template: t.Optional(t.Union([t.Boolean(), t.Null()])),
    parent_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    dice_color: t.Optional(t.Union([t.String(), t.Null()])),
    owner_id: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
      alter_names: t.Optional(
        t.Array(
          t.Object({
            title: t.String(),
          }),
        ),
      ),
      tags: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
      ),
      template_fields: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
            key: t.String(),
            value: t.Union([t.Null(), t.String()]),
            blueprint_id: t.Optional(t.Union([t.Null(), t.String()])),
            map_id: t.Optional(t.Union([t.Null(), t.String()])),
            calendar_id: t.Optional(t.Union([t.Null(), t.String()])),
            dictionary_id: t.Optional(t.Union([t.Null(), t.String()])),
            formula: t.Union([t.Null(), t.String()]),
            derive_from: t.Union([t.Null(), t.String()]),
            derive_formula: t.Union([t.Null(), t.String()]),
            entity_type: DocumentTemplateEntityTypes,
            is_randomized: t.Union([t.Boolean(), t.Null()]),
            random_count: t.Optional(t.Union([t.String(), t.Null()])),
            related: t.Array(t.String()),
            sort: t.Number({ default: 0 }),
          }),
        ),
      ),
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

export const GenerateDocumentSchema = t.Object({
  data: t.Object({
    title: t.String(),
    parent_id: t.Optional(t.String()),
    project_id: t.String(),
    content: t.Optional(t.String()),
  }),
});

export const AutolinkerSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    text: t.String(),
    ignore: t.String(),
    type: t.Union([
      t.Literal("documents"),
      t.Literal("characters"),
      t.Literal("blueprint_instances"),
      t.Literal("maps"),
      t.Literal("map_pins"),
      t.Literal("graphs"),
      t.Literal("events"),
      t.Literal("words"),
    ]),
  }),
});

export const MentionsInDocumentSchema = t.Object({
  data: t.Object({
    mentions: t.Record(
      t.Union([
        t.Optional(t.Literal("documents")),
        t.Optional(t.Literal("characters")),
        t.Optional(t.Literal("blueprint_instances")),
        t.Optional(t.Literal("maps")),
        t.Optional(t.Literal("map_pins")),
        t.Optional(t.Literal("graphs")),
        t.Optional(t.Literal("words")),
      ]),
      t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
      ),
    ),
  }),
});

export const FromTemplateRandomCountSchema = t.Union([
  t.Null(),
  t.Literal("single"),
  t.Literal("max_2"),
  t.Literal("max_3"),
  t.Literal("max_4"),
  t.Literal("max_5"),
  t.Literal("max_6"),
  t.Literal("max_7"),
  t.Literal("max_8"),
  t.Literal("max_9"),
  t.Literal("max_10"),
  t.Literal("max_15"),
  t.Literal("max_20"),
]);

export const FromTemplateSchema = t.Object({
  data: t.Object({ title: t.String(), content: t.Any() }),
  relations: t.Object({
    template_fields: t.Array(
      t.Object(
        {
          key: t.String(),
          value: t.Union([t.Null(), t.String()]),
          entity_type: DocumentTemplateEntityTypes,
          is_randomized: t.Union([t.Boolean(), t.Null()]),
          random_count: t.Optional(FromTemplateRandomCountSchema),
          related: t.Union([t.Array(t.String()), t.Null()]),
        },
        { additionalProperties: true },
      ),
    ),
  }),
});

export const GeneratePDFSchema = t.Object({ data: t.Object({ title: t.String(), body: t.String() }) });
