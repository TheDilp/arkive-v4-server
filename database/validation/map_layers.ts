import { t } from "elysia";

export const InsertMapLayerSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    title: t.String(),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
});
export const UpdateMapLayerSchema = t.Object({
  data: t.Object({
    lat: t.Optional(t.Number()),
    lng: t.Optional(t.Number()),
    title: t.Optional(t.Union([t.String(), t.Null()])),
    color: t.Optional(t.Union([t.String(), t.Null()])),
    border_color: t.Optional(t.Union([t.String(), t.Null()])),
    background_color: t.Optional(t.Union([t.String(), t.Null()])),
    icon: t.Optional(t.Union([t.String(), t.Null()])),
    show_background: t.Optional(t.Boolean()),
    show_border: t.Optional(t.Boolean()),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    map_link: t.Optional(t.Union([t.String(), t.Null()])),
    doc_id: t.Optional(t.Union([t.String(), t.Null()])),
    image_id: t.Optional(t.Union([t.String(), t.Null()])),
    character_id: t.Optional(t.Union([t.String(), t.Null()])),
  }),
  relations: t.Optional(t.Object({ tags: t.Optional(t.Array(t.Object({ id: t.String() }))) })),
});
