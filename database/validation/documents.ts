import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

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
        }),
      ),
    }),
  ),
]);
export const ListDocumentSchema = t.Intersect([
  RequestBodySchema,
  t.Object({ data: t.Object({ project_id: t.String() }), relations: t.Optional(t.Object({ tags: t.Optional(t.Boolean()) })) }),
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
      tags: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
      ),
    }),
  ),
});
export const UpdateDocumentSchema = t.Object({
  data: t.Object({
    id: t.String(),
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
      tags: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
      ),
    }),
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
