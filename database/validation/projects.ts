import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";

const ProjectFontSchema = t.Union(
  [
    t.Literal("Arial"),
    t.Literal("Courier New"),
    t.Literal("Comic Sans"),
    t.Literal("Fantasy"),
    t.Literal("Garamond"),
    t.Literal("Georgia"),
    t.Literal("Lato"),
    t.Literal("Merriweather"),
    t.Literal("Tahoma"),
    t.Literal("Times New Roman"),
    t.Literal("Trebuchet MS"),
    t.Literal("Verdana"),
  ],
  { default: "Lato" },
);

export const ReadProjectSchema = t.Intersect([
  RequestBodySchema,
  t.Optional(
    t.Object({
      relations: t.Optional(
        t.Object({
          roles: t.Optional(t.Boolean()),
          map_pin_types: t.Optional(t.Boolean()),
          character_relationship_types: t.Optional(t.Boolean()),
          members: t.Optional(t.Boolean()),
          owner: t.Optional(t.Boolean()),
          feature_flags: t.Optional(t.Boolean()),
          game_system: t.Optional(t.Boolean()),
          tags: t.Optional(t.Boolean()),
        }),
      ),
    }),
  ),
]);

export const InsertProjectSchema = t.Object({
  data: t.Object({
    title: t.String(),
    description: t.Optional(t.Union([t.Null(), t.String()])),
    default_project_font: ProjectFontSchema,
  }),
});

export const UpdateProjectSchema = t.Object({
  data: t.Object({
    id: t.Optional(t.String()),
    game_system_id: t.Optional(t.Union([t.String(), t.Null()])),
    title: t.Optional(t.String()),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    is_public: t.Optional(t.Union([t.Null(), t.Boolean()])),
    description: t.Optional(t.Union([t.Null(), t.String()])),
    default_dice_color: t.Optional(t.Union([t.String(), t.Null()])),
    show_image_folder_view: t.Optional(t.Union([t.Boolean(), t.Null()])),
    show_image_table_view: t.Optional(t.Union([t.Boolean(), t.Null()])),
    default_project_font: ProjectFontSchema,
  }),
});

export const DashboardSchema = t.Object({ data: t.Object({ enabled_entities: t.Array(t.String()) }) });
