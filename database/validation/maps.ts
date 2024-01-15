import { t } from "elysia";

import { RequestBodySchema } from "../../types/requestTypes";
import { InsertMapLayerSchema, UpdateMapLayerSchema } from "./map_layers";

export const ReadMapSchema = t.Intersect([
  RequestBodySchema,
  t.Object({
    relations: t.Optional(
      t.Object({
        map_pins: t.Optional(t.Boolean()),
        map_layers: t.Optional(t.Boolean()),
        images: t.Optional(t.Boolean()),
        tags: t.Optional(t.Boolean()),
        children: t.Optional(t.Boolean()),
        parents: t.Optional(t.Boolean()),
      }),
    ),
  }),
]);

export const InsertMapSchema = t.Object({
  data: t.Object({
    title: t.String(),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    cluster_pins: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.Null(), t.String()])),
    project_id: t.String(),
    parent_id: t.Optional(t.Union([t.Null(), t.String()])),
    image_id: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
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

export const UpdateMapSchema = t.Object({
  data: t.Object({
    title: t.Optional(t.String()),
    is_folder: t.Optional(t.Union([t.Boolean(), t.Null()])),
    is_public: t.Optional(t.Union([t.Boolean(), t.Null()])),
    cluster_pins: t.Optional(t.Union([t.Boolean(), t.Null()])),
    icon: t.Optional(t.Union([t.Null(), t.String()])),
    parent_id: t.Optional(t.Union([t.Null(), t.String()])),
    image_id: t.Optional(t.String()),
  }),
  relations: t.Optional(
    t.Object({
      tags: t.Optional(
        t.Array(
          t.Object({
            id: t.String(),
          }),
        ),
      ),
      map_layers: t.Union([t.Array(InsertMapLayerSchema, { minItems: 0 }), t.Array(UpdateMapLayerSchema, { minItems: 0 })]),
    }),
  ),
});
