import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

export const ReadProjectSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          map_pin_types: t.Optional(t.Boolean()),
          character_relationship_types: t.Optional(t.Boolean()),
          members: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertProjectSchema = t.Object({
  data: t.Object({ owner_id: t.String(), title: t.String(), image: t.Optional(t.String()) }),
});

export const UpdateProjectSchema = t.Object({
  data: t.Object({
    id: t.Optional(t.String()),
    title: t.Optional(t.String()),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    default_dice_color: t.Optional(t.Union([t.String(), t.Null()])),
    show_image_folder_view: t.Optional(t.Union([t.Boolean(), t.Null()])),
    show_image_table_view: t.Optional(t.Union([t.Boolean(), t.Null()])),
  }),
});

export const ProjectListSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    data: t.Object({
      auth_id: t.String(),
    }),
  }),
]);
