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
export const ListDocumentSchema = t.Intersect([RequestBodySchema, t.Object({ data: t.Object({ project_id: t.String() }) })]);

export const InsertDocumentSchema = t.Object({
  data: t.Object({
    project_id: t.String(),
    title: t.Optional(t.String()),
    content: t.Optional(t.Union([t.String(), t.Null()])),
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
            project_id: t.String(),
            parent_id: t.String(),
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
    content: t.Optional(t.Union([t.String(), t.Null()])),
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
            project_id: t.String(),
            parent_id: t.String(),
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
