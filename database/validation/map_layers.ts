import { t } from "elysia";

export const InsertMapLayerSchema = t.Object({
  data: t.Object({
    parent_id: t.String(),
    title: t.String(),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    image_id: t.String(),
  }),
});
export const UpdateMapLayerSchema = t.Object({
  data: t.Object({
    title: t.String(),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    image_id: t.String(),
  }),
});
